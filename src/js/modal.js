$(() => {
  const modalEl = $('#app_modal');
  const modalHeader = $('#modal_header');
  const modalMsg = $('#modal_msg');
  const modalCloser = $('#modal_close');

  const showModalClass = 'show';
  const maximumMsgLength = 92;

  let modalTimeout;

  const modal = {
    show({ msg, header, duration }) {
      const time = duration || 3000;

      // Set Another Timeout For Mutiple Modal
      if (modalTimeout) {
        clearTimeout(modalTimeout);
        modalTimeout = setTimeout(this.close, time);
      }

      modalHeader.text(header);

      if (msg.length > maximumMsgLength) {
        modalMsg.text(msg.slice(0, -3) + '...');
      } else {
        modalMsg.text(msg);
      }

      modalCloser.on('click', this.close);

      modalEl.addClass(showModalClass);

      modalTimeout = setTimeout(this.close, time);
    },
    close() {
      clearTimeout(modalTimeout);

      modalTimeout = null;

      modalEl.removeClass(showModalClass);
    }
  };

  window.modal = modal;
});
