package app.meshwarden.android;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Base64;
import android.view.Window;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Pattern;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {
    private static final String HOST = "https://api.tailscale.com";
    private static final int MAX_BODY = 48_000;
    private static final int MAX_RESPONSE = 1_500_000;
    private static final Pattern TAILNET =
            Pattern.compile("/api/v2/tailnet/[A-Za-z0-9._-]{1,253}");
    private static final Pattern DEVICE = Pattern.compile("/api/v2/device/[A-Za-z0-9]{1,64}");
    private static final Pattern ID = Pattern.compile("[A-Za-z0-9-]{1,80}");

    private WebView webView;
    private boolean alive = true;
    private final ExecutorService pool = Executors.newFixedThreadPool(3);

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();
        webView = new WebView(this);
        setContentView(webView);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportMultipleWindows(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        webView.addJavascriptInterface(new Bridge(), "Meshwarden");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assets.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return request.getUrl().getHost() == null
                        || !"appassets.androidplatform.net".equals(request.getUrl().getHost());
            }
        });
        webView.loadUrl("https://appassets.androidplatform.net/assets/www/android-ui/index.html");
    }

    @Override
    protected void onDestroy() {
        alive = false;
        pool.shutdownNow();
        if (webView != null) webView.destroy();
        super.onDestroy();
    }

    private void finish(String id, boolean ok, int status, String body) {
        if (!alive || webView == null) return;
        String payload = Base64.encodeToString(body.getBytes(StandardCharsets.UTF_8), Base64.NO_WRAP);
        String script = "window.__meshDone&&window.__meshDone("
                + JSONObject.quote(id) + ","
                + (ok ? "true" : "false") + ","
                + status + ","
                + JSONObject.quote(payload) + ")";
        webView.post(() -> {
            if (alive && webView != null) webView.evaluateJavascript(script, null);
        });
    }

    private final class Bridge {
        @JavascriptInterface
        public void setChrome(String color) {
            if (color == null || !color.matches("#[0-9A-Fa-f]{6}")) return;
            final int parsed = Color.parseColor(color);
            double luminance = (0.2126 * Color.red(parsed) + 0.7152 * Color.green(parsed) + 0.0722 * Color.blue(parsed)) / 255d;
            final boolean light = luminance > 0.6;
            runOnUiThread(() -> {
                Window window = getWindow();
                window.setStatusBarColor(parsed);
                window.setNavigationBarColor(parsed);
                WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(window, window.getDecorView());
                controller.setAppearanceLightStatusBars(light);
                controller.setAppearanceLightNavigationBars(light);
            });
        }

        @JavascriptInterface
        public void request(String id, String method, String path, String body, String authorization, String contentType) {
            if (id == null || !ID.matcher(id).matches()) return;
            pool.execute(() -> {
                try {
                    String blocked = reject(method, path, body, authorization, contentType);
                    if (blocked != null) {
                        finish(id, false, 0, blocked);
                        return;
                    }
                    HttpURLConnection conn = (HttpURLConnection) new URL(HOST + path).openConnection();
                    conn.setInstanceFollowRedirects(false);
                    conn.setConnectTimeout(15_000);
                    conn.setReadTimeout(15_000);
                    conn.setRequestMethod(method);
                    conn.setRequestProperty("Authorization", authorization);
                    conn.setRequestProperty("Accept", "application/json");
                    conn.setRequestProperty("User-Agent", "Meshwarden-Android/1.0.3");
                    if (body != null && !body.isEmpty()) {
                        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                        conn.setDoOutput(true);
                        conn.setRequestProperty("Content-Type", contentType);
                        conn.getOutputStream().write(bytes);
                    }
                    int status = conn.getResponseCode();
                    if (status >= 300 && status < 400) {
                        conn.disconnect();
                        finish(id, false, 0, "Tailscale redirected that call. It was blocked.");
                        return;
                    }
                    InputStream stream = status >= 400 ? conn.getErrorStream() : conn.getInputStream();
                    String text = readLimited(stream);
                    conn.disconnect();
                    finish(id, true, status, text);
                } catch (Exception error) {
                    finish(id, false, 0, "Could not reach Tailscale.");
                }
            });
        }
    }

    private static String reject(String method, String path, String body, String authorization, String contentType) {
        if (method == null || path == null || authorization == null) return "Blocked.";
        if (!path.startsWith("/api/v2/") || path.contains("..") || path.contains("\\") || path.contains(" ") || path.contains("#") || path.contains("@")) {
            return "Blocked.";
        }
        if (path.length() > 320) return "Blocked.";
        if (authorization.indexOf('\n') >= 0 || authorization.indexOf('\r') >= 0 || authorization.length() > 2000) return "Blocked.";
        if (!authorization.startsWith("Bearer ") && !authorization.startsWith("Basic ")) return "Blocked.";
        if (body != null && body.length() > MAX_BODY) return "Blocked.";
        if (contentType != null && !contentType.isEmpty()
                && !"application/json".equals(contentType)
                && !"application/x-www-form-urlencoded".equals(contentType)) {
            return "Blocked.";
        }
        int queryAt = path.indexOf('?');
        String route = queryAt >= 0 ? path.substring(0, queryAt) : path;
        String query = queryAt >= 0 ? path.substring(queryAt) : "";
        if ("GET".equals(method) && route.startsWith("/api/v2/tailnet/") && route.endsWith("/devices") && "?fields=all".equals(query) && tailnetRoute(route, "/devices")) {
            return null;
        }
        if ("GET".equals(method) && query.isEmpty() && (
                (route.endsWith("/dns/nameservers") && tailnetRoute(route, "/dns/nameservers"))
                        || (route.endsWith("/dns/preferences") && tailnetRoute(route, "/dns/preferences"))
                        || (route.endsWith("/dns/searchpaths") && tailnetRoute(route, "/dns/searchpaths"))
                        || (route.endsWith("/acl") && tailnetRoute(route, "/acl")))) {
            return null;
        }
        if ("POST".equals(method) && "/api/v2/oauth/token".equals(route) && query.isEmpty()) return null;
        if ("POST".equals(method) && query.isEmpty() && route.endsWith("/authorized") && deviceRoute(route, "/authorized")) return null;
        if ("POST".equals(method) && query.isEmpty() && route.endsWith("/expire") && deviceRoute(route, "/expire")) return null;
        if ("POST".equals(method) && query.isEmpty() && route.endsWith("/routes") && deviceRoute(route, "/routes")) return null;
        if ("DELETE".equals(method) && query.isEmpty() && DEVICE.matcher(route).matches()) return null;
        return "Blocked.";
    }

    private static boolean tailnetRoute(String route, String suffix) {
        if (!route.endsWith(suffix)) return false;
        String head = route.substring(0, route.length() - suffix.length());
        return TAILNET.matcher(head).matches();
    }

    private static boolean deviceRoute(String route, String suffix) {
        if (!route.endsWith(suffix)) return false;
        String head = route.substring(0, route.length() - suffix.length());
        return DEVICE.matcher(head).matches();
    }

    private static String readLimited(InputStream stream) throws Exception {
        if (stream == null) return "";
        try (InputStream in = stream) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int total = 0;
            int read;
            while ((read = in.read(buf)) != -1) {
                total += read;
                if (total > MAX_RESPONSE) return "";
                out.write(buf, 0, read);
            }
            return out.toString(StandardCharsets.UTF_8);
        }
    }
}
