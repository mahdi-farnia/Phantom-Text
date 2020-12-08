$(() => {
  const leftPanel = $('#left-panel');
  const classList = {
    openPanel: 'open',
    goOptions: 'options',
    goSavedScripts: 'saved-scripts'
  };

  // Toggle Left Panel Buttons
  const options = 'nav_app-options';
  const savedScript = 'nav_saved-script';

  $('#menu').on('click', ({ target }) => {
    switch ($(target).attr('id')) {
      case options:
        if (
          leftPanel.hasClass(classList.goOptions) &&
          leftPanel.hasClass(classList.openPanel)
        ) {
          leftPanel.removeClass(classList.openPanel);
          return;
        }

        leftPanel.addClass(classList.openPanel);

        leftPanel
          .removeClass(classList.goSavedScripts)
          .addClass(classList.goOptions);
        return;

      case savedScript:
        if (
          leftPanel.hasClass(classList.goSavedScripts) &&
          leftPanel.hasClass(classList.openPanel)
        ) {
          leftPanel.removeClass(classList.openPanel);
          return;
        }

        leftPanel.addClass(classList.openPanel);

        leftPanel
          .removeClass(classList.goOptions)
          .addClass(classList.goSavedScripts);
        return;
    }
  });

  const toggleRealtimeTransfer = 'use_realtime_transfer';
  const toggleWindowAlwaysOnTop = 'use_always-on-top';
  const goSavedScripts = 'dot_saved-script';
  const goOptions = 'dot_options';

  const RealtimeStatusEvent = new $.Event('realtime-change', {
    isActive: null
  });

  leftPanel.on('click', function ({ target }) {
    switch ($(target).attr('id')) {
      case toggleRealtimeTransfer:
        let isActive = (RealtimeStatusEvent.isActive = $(target).prop(
          'checked'
        ));

        modal.show({
          msg: `Text Transform Is Now ${isActive ? 'On' : 'Off'}`,
          header: 'Text Transform'
        });

        $(document).trigger(RealtimeStatusEvent);
        return;

      case toggleWindowAlwaysOnTop:
        let isOn = $(target).prop('checked');

        modal.show({
          msg: `Always On Top Is Now ${isOn ? 'On' : 'Off'}`,
          header: 'Always On Top'
        });

        ipc.send(Events.ALWAYS_ON_TOP_CHANGE, isOn);
        return;

      case goSavedScripts:
        $(this)
          .removeClass(classList.goOptions)
          .addClass(classList.goSavedScripts);
        return;

      case goOptions:
        $(this)
          .removeClass(classList.goSavedScripts)
          .addClass(classList.goOptions);
        return;
    }
  });
});
