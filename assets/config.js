/* Public configuration only. Never put credentials or provider keys here.
 * Set the HTTPS API base before opening the waitlist.
 * The client appends /v1/waitlist. Empty means unavailable, not a local signup.
 */
window.CLARITY_CONFIG = Object.freeze({
  waitlistApiBase: "https://clarity-api.tjagent.cc"
});
