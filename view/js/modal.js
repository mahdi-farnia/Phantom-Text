$(() => {
  const modal = $('#modal');
  const modalHeader = $('#modal_header');
  const modalMsg = $('#modal_msg');
  const modalCloser = $('#modal_close');

  const showModalClass = 'show';
  const maximumMsgLength = 92;

  let modalTimeout;

  window.modal = {
    show: function ({ msg, header, duration }) {
      modalHeader.text(header);

      if (msg.length > maximumMsgLength) {
        modalMsg.text(msg.slice(0, -3) + '...');
      } else {
        modalMsg.text(msg);
      }

      modalCloser.on('click', () => {
        clearTimeout(modalTimeout);
        modalTimeout = null;
        modal.removeClass(showModalClass);
      });

      modal.addClass(showModalClass);

      modalTimeout = setTimeout(() => {
        modal.removeClass(showModalClass);
      }, duration || 3000);
    }
  };
});
