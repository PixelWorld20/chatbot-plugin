<?php
/**
 * Plugin Name: Pixel Global AI Chatbot
 * Plugin URI:  https://github.com/aby-a11y/pixel-global-ai
 * Description: Pixel Global AI chatbot widget — [pixelglobal_chat] use
 * Version:     1.0.0
 * Author:      Pixel Global IT
 * Author URI:  https://pixelglobal.in
 * License:     GPL-2.0+
 * Text Domain: pixel-global-ai-chatbot
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'PGAI_VERSION', '1.0.0' );
define( 'PGAI_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PGAI_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/* ─── Admin Settings Page ─── */
add_action( 'admin_menu', 'pgai_admin_menu' );
function pgai_admin_menu() {
    add_options_page(
        'Pixel Global AI Chatbot Settings',
        'PG AI Chatbot',
        'manage_options',
        'pgai-settings',
        'pgai_settings_page'
    );
}

add_action( 'admin_init', 'pgai_register_settings' );
function pgai_register_settings() {
    register_setting( 'pgai_settings_group', 'pgai_api_url',        [ 'sanitize_callback' => 'esc_url_raw',    'default' => '' ] );
    register_setting( 'pgai_settings_group', 'pgai_bot_name',       [ 'sanitize_callback' => 'sanitize_text_field', 'default' => 'Pixel Global AI' ] );
    register_setting( 'pgai_settings_group', 'pgai_placeholder',    [ 'sanitize_callback' => 'sanitize_text_field', 'default' => 'ask anything...' ] );
    register_setting( 'pgai_settings_group', 'pgai_welcome_msg',    [ 'sanitize_callback' => 'sanitize_text_field', 'default' => 'hi! i am Pixel Global AI ?' ] );
    register_setting( 'pgai_settings_group', 'pgai_primary_color',  [ 'sanitize_callback' => 'sanitize_hex_color', 'default' => '#0066cc' ] );
    register_setting( 'pgai_settings_group', 'pgai_position',       [ 'sanitize_callback' => 'sanitize_text_field', 'default' => 'bottom-right' ] );
    register_setting( 'pgai_settings_group', 'pgai_mode',           [ 'sanitize_callback' => 'sanitize_text_field', 'default' => 'floating' ] );
}

function pgai_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    ?>
    <div class="wrap" id="pgai-wrap">
        <h1 style="display:flex;align-items:center;gap:10px;">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#0066cc"/>
                <path d="M8 10h16M8 16h10M8 22h13" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
                <circle cx="24" cy="22" r="4" fill="#fff"/>
                <path d="M22.5 22l1 1 2-2" stroke="#0066cc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Pixel Global AI Chatbot — Settings
        </h1>
        <form method="post" action="options.php" style="margin-top:20px;">
            <?php settings_fields( 'pgai_settings_group' ); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th><label for="pgai_api_url">Railway API URL <span style="color:red">*</span></label></th>
                    <td>
                        <input type="url" id="pgai_api_url" name="pgai_api_url" class="regular-text"
                               value="<?php echo esc_attr( get_option('pgai_api_url') ); ?>"
                               placeholder="https://your-app.up.railway.app" required>
                        <p class="description">Aapka Railway deployment URL — last mein / mat lagao</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="pgai_bot_name">Bot name</label></th>
                    <td><input type="text" id="pgai_bot_name" name="pgai_bot_name" class="regular-text"
                               value="<?php echo esc_attr( get_option('pgai_bot_name', 'Pixel Global AI') ); ?>"></td>
                </tr>
                <tr>
                    <th><label for="pgai_welcome_msg">Welcome Message</label></th>
                    <td><textarea id="pgai_welcome_msg" name="pgai_welcome_msg" class="large-text" rows="2"
                                  ><?php echo esc_textarea( get_option('pgai_welcome_msg', 'Namaste! i am Pixel Global ') ); ?></textarea></td>
                </tr>
                <tr>
                    <th><label for="pgai_placeholder">Input Placeholder</label></th>
                    <td><input type="text" id="pgai_placeholder" name="pgai_placeholder" class="regular-text"
                               value="<?php echo esc_attr( get_option('pgai_placeholder', 'Kuch bhi puchein...') ); ?>"></td>
                </tr>
                <tr>
                    <th><label for="pgai_primary_color">Primary Color</label></th>
                    <td><input type="color" id="pgai_primary_color" name="pgai_primary_color"
                               value="<?php echo esc_attr( get_option('pgai_primary_color', '#0066cc') ); ?>"></td>
                </tr>
                <tr>
                    <th><label for="pgai_mode">Display Mode</label></th>
                    <td>
                        <select id="pgai_mode" name="pgai_mode">
                            <option value="floating" <?php selected( get_option('pgai_mode','floating'), 'floating' ); ?>>Floating Button (corner pe)</option>
                            <option value="inline"   <?php selected( get_option('pgai_mode','floating'), 'inline' );   ?>>Inline (shortcode se page me)</option>
                        </select>
                        <p class="description">Floating = all pages  corner button. Inline = shortcode <code>[pixelglobal_chat]</code> apply</p>
                    </td>
                </tr>
                <tr>
                    <th><label for="pgai_position">Floating Position</label></th>
                    <td>
                        <select id="pgai_position" name="pgai_position">
                            <option value="bottom-right" <?php selected( get_option('pgai_position','bottom-right'), 'bottom-right' ); ?>>Bottom Right</option>
                            <option value="bottom-left"  <?php selected( get_option('pgai_position','bottom-right'), 'bottom-left' );  ?>>Bottom Left</option>
                        </select>
                    </td>
                </tr>
            </table>
            <?php submit_button( 'Settings Save' ); ?>
        </form>

        <hr>
        <h2>Shortcode</h2>
        <p>peast shortcode in any page:</p>
        <code style="font-size:16px;background:#f0f0f0;padding:8px 14px;border-radius:4px;">[pixelglobal_chat]</code>

        <h2 style="margin-top:24px;">Connection Test</h2>
        <?php
        $api_url = get_option('pgai_api_url');
        if ( $api_url ) {
            $response = wp_remote_post( $api_url . '/chat', [
                'timeout' => 10,
                'headers' => [ 'Content-Type' => 'application/json' ],
                'body'    => wp_json_encode( [ 'message' => 'ping test' ] ),
            ]);
            if ( is_wp_error( $response ) ) {
                echo '<div class="notice notice-error"><p>❌ Connection failed: ' . esc_html( $response->get_error_message() ) . '</p></div>';
            } else {
                $code = wp_remote_retrieve_response_code( $response );
                echo $code === 200
                    ? '<div class="notice notice-success"><p>✅ Railway API se successfully connected! (HTTP ' . $code . ')</p></div>'
                    : '<div class="notice notice-warning"><p>⚠️ API responded with HTTP ' . $code . ' — URL use it</p></div>';
            }
        } else {
            echo '<div class="notice notice-warning"><p>⚠️ Pehle API url.</p></div>';
        }
        ?>
    </div>
    <?php
}

/* ─── CORS Proxy Endpoint (WP REST API) ─── */
add_action( 'rest_api_init', 'pgai_register_proxy_route' );
function pgai_register_proxy_route() {
    register_rest_route( 'pgai/v1', '/chat', [
        'methods'             => 'POST',
        'callback'            => 'pgai_proxy_chat',
        'permission_callback' => '__return_true',
    ]);
}

function pgai_proxy_chat( WP_REST_Request $request ) {
    $api_url = get_option( 'pgai_api_url' );
    if ( ! $api_url ) {
        return new WP_REST_Response( [ 'response' => 'API URL configured failed' ], 500 );
    }

    $body    = $request->get_json_params();
    $message = isset( $body['message'] ) ? sanitize_text_field( $body['message'] ) : '';

    if ( empty( $message ) ) {
        return new WP_REST_Response( [ 'response' => 'Empty message' ], 400 );
    }

    $rail_response = wp_remote_post( $api_url . '/chat', [
        'timeout' => 30,
        'headers' => [ 'Content-Type' => 'application/json' ],
        'body'    => wp_json_encode( [ 'message' => $message ] ),
    ]);

    if ( is_wp_error( $rail_response ) ) {
        return new WP_REST_Response( [ 'response' => 'Server is not connected .' ], 503 );
    }

    $data = json_decode( wp_remote_retrieve_body( $rail_response ), true );
    return new WP_REST_Response( $data, 200 );
}

/* ─── Enqueue Assets ─── */
add_action( 'wp_enqueue_scripts', 'pgai_enqueue_assets' );
function pgai_enqueue_assets() {
    $api_url = get_option( 'pgai_api_url' );
    

    wp_enqueue_style(
        'pgai-chatbot-style',
        PGAI_PLUGIN_URL . 'chatbot.css',
        [],
        PGAI_VERSION
    );

    wp_enqueue_script(
        'pgai-chatbot-script',
        PGAI_PLUGIN_URL . 'chatbot.js',
        [],
        PGAI_VERSION,
        true
    );

    wp_localize_script( 'pgai-chatbot-script', 'PGAI_CONFIG', [
        'proxyUrl'     => rest_url( 'pgai/v1/chat' ),
        'nonce'        => wp_create_nonce( 'wp_rest' ),
        'botName'      => get_option( 'pgai_bot_name',    'Pixel Global AI' ),
        'placeholder'  => get_option( 'pgai_placeholder', 'ask anything...' ),
        'welcomeMsg'   => get_option( 'pgai_welcome_msg', 'Namaste! i am Pixel Global AI ' ),
        'primaryColor' => get_option( 'pgai_primary_color', '#0066cc' ),
        'position'     => get_option( 'pgai_position',    'bottom-right' ),
        'mode'         => get_option( 'pgai_mode',        'floating' ),
    ]);
}

/* ─── Shortcode ─── */
add_shortcode( 'pixelglobal_chat', 'pgai_inline_shortcode' );
function pgai_inline_shortcode() {
    $api_url = get_option( 'pgai_api_url' );
    if ( ! $api_url ) {
        return '<p style="color:red;">⚠️ Pixel Global AI: API URL settings configure .</p>';
    }
    return '<div id="pgai-inline-widget" class="pgai-inline-container"></div>';
}

/* ─── Admin Body Class ─── */
add_filter( 'admin_body_class', function( $classes ) {
    return $classes . ' pgai-admin';
});
