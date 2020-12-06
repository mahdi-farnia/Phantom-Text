$(() => {
  const themeChanger = $('#change_theme');
  const style = $('#theme_settings');

  const CssVar = {
    dark: `:root {
      --text-color: #f1f1f1;
      --bg-color: #2d2d2d;
      --secondary-color: #1b1b1b;
      --toolbar-bg-color: linear-gradient(0deg, rgb(41 41 41), rgb(60 60 60));
      --button-shadow: -2px -2px 10px #4a4a4a, 2px 2px 10px #000000;
      --button-shadow-reverse: inset -2px -2px 10px #4a4a4a,
        inset 2px 2px 10px #000000;
      --border-color: #404040;
    }
    `,
    light: `:root {
      --text-color: #2d2d2d;
      --bg-color: #fff;
      --secondary-color: #eee;
      --toolbar-bg-color: linear-gradient(
        0deg,
        rgb(230 230 230),
        rgb(239 239 239)
      );
      --button-shadow: -2px -2px 10px #ffffff, 2px 2px 10px #bbbbbb;
      --button-shadow-reverse: inset -2px -2px 10px #ffffff,
        inset 2px 2px 10px #bbbbbb;
      --border-color: var(--secondary-color);
    }
    `
  };

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
    if (which === 'dark') style.html(CssVar.dark);
    else style.html(CssVar.light);
  }
});
