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
      const isDark = themeChanger.prop('checked');
      const isSystemDark = which === 'dark' ? true : false;

      if (isDark !== isSystemDark) themeChanger.trigger('click');
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
        '--secondary-color': '#1b1b1b',
        '--toolbar-bg-color':
          'linear-gradient(0deg, rgb(86, 86, 86), rgb(130, 130, 130))'
      });
    } else {
      $(document.documentElement).css({
        '--text-color': '#2d2d2d',
        '--bg-color': '#fff',
        '--secondary-color': '#eee',
        '--toolbar-bg-color':
          'linear-gradient(0deg, rgb(230 230 230), rgb(239 239 239))'
      });
    }
  }
});
