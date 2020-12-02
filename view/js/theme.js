$(() => {
  const themeChanger = $('#change_theme');

  // Chnage Theme Changer Status Based System
  if (matchMedia('(prefers-color-scheme: dark)').matches) {
    themeChanger.prop('checked', true);
  }

  // Detect Theme Change
  ipc.on(
    Events.SYSTEM_THEME_CHANGED,
    /**
     * @param { "dark" | "light" } which
     */
    (e, which) => {
      themeChanger.prop('checked', which === 'dark' ? true : false);
    }
  );

  // Change Theme On Click
  themeChanger.on('click', () =>
    changeTheme(themeChanger.prop('checked') ? 'dark' : 'light')
  );

  /**
   * Change Theme of App
   * @param {"dark" | "light"} which
   */
  function changeTheme(which) {
    if (which === 'dark') {
      $(document.documentElement).css({
        '--text-color': '#f1f1f1',
        '--bg-color': '#2d2d2d',
        '--shadow-color': '#1b1b1b'
      });
    } else {
      $(document.documentElement).css({
        '--text-color': '#2d2d2d',
        '--bg-color': '#fff',
        '--shadow-color': '#eee'
      });
    }
  }
});
