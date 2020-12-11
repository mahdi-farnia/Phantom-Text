/**
 * These Properties Should Be Unique But Values Are Optional
 */

module.exports = {
  APP_LOADED: 'event::dom_content_loaded',
  SYSTEM_INFO: 'data::process_platform',
  BROWSER_FOCUSED: 'event::browser_window_focused',
  SYSTEM_THEME_CHANGED: 'event::theme_changed',
  REQUEST_ENCODE: 'data::encode_text',
  REQUEST_DECODE: 'data::decode_text',
  GET_ENCODED: 'data::encoded_text',
  GET_DECODED: 'data:decoded_text',
  ALWAYS_ON_TOP_CHANGE: 'event::window_always-on-top-change',
  SET_MINIMUM_SIZE: 'event::view_content_size_changed',
  REGISTER_KEY: 'data::register_new_key',
  GENERATE_KEY: 'event::request_generate_key',
  GENERATED_KEY: 'data::generated_key'
};
