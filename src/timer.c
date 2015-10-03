#include <pebble.h>
  
static Window *s_main_window;
static TextLayer *s_uptime_layer;

static int s_uptime = 10;

static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
  // Use a long-lived buffer
  static char s_uptime_buffer[32];

  // Get time since launch
  int seconds = s_uptime % 60;
  int minutes = (s_uptime % 3600) / 60;
  int hours = s_uptime / 3600;

  // Update the TextLayer
  snprintf(s_uptime_buffer, sizeof(s_uptime_buffer), "%dh %dm %ds", hours, minutes, seconds);
  text_layer_set_text(s_uptime_layer, s_uptime_buffer);
  text_layer_set_font(s_time_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
  if (s_uptime == 0){
    static const uint32_t const segments[] = { 200, 100, 400 , 900};
  VibePattern pat = {
    .durations = segments,
    .num_segments = ARRAY_LENGTH(segments),
  };
vibes_enqueue_custom_pattern(pat);
    tick_timer_service_unsubscribe();
  }
  
  // Increment s_uptime
  s_uptime--;
  
}

static void main_window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect window_bounds = layer_get_bounds(window_layer);

  // Create output TextLayer
  s_uptime_layer = text_layer_create(GRect(0, 0, window_bounds.size.w, window_bounds.size.h));
  text_layer_set_text_alignment(s_uptime_layer, GTextAlignmentCenter);
  text_layer_set_text(s_uptime_layer, "0h 0m 0s");
  layer_add_child(window_layer, text_layer_get_layer(s_uptime_layer));
}

static void main_window_unload(Window *window) {
  // Destroy output TextLayer
  text_layer_destroy(s_uptime_layer);
}

static void init(void) {
  // Create main Window
  s_main_window = window_create();
  window_set_window_handlers(s_main_window, (WindowHandlers) {
    .load = main_window_load,
    .unload = main_window_unload,
  });
  window_stack_push(s_main_window, true);

  // Subscribe to TickTimerService
  tick_timer_service_subscribe(SECOND_UNIT, tick_handler);
}

static void deinit(void) {
  // Destroy main Window
  window_destroy(s_main_window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}