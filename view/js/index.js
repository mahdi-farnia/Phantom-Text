const { ipcRenderer: ipc } = require('electron');
const { join: joinPath } = require('path');
const Events = require(joinPath(__dirname, '../modules/Events.js'));
const { clipboard } = navigator;

$(() => {
  const input = $('#encode_field');
  const output = $('#output_field');
  let copyTextToClipboard = false;

  // Real time encode
  input.on('input', encodeInputText);
  output.on('input', decodeInputText);

  // Read Options
  const useFastEncode = $('#use_fast_encode'),
    useFastDecode = $('#use_fast_decode');
  let isFastEncodeEnabled = false,
    isFastDecodeEnabled = false;

  useFastEncode.on('click', function () {
    // Turn Off Fast Decode
    if (isFastDecodeEnabled) useFastDecode.trigger('click');

    isFastEncodeEnabled = $(this).prop('checked');

    if (isFastEncodeEnabled) ipc.on(Events.BROWSER_FOCUSED, fastEncode);
    else ipc.off(Events.BROWSER_FOCUSED, fastEncode);
  });

  useFastDecode.on('click', function () {
    // Turn Off Fast Encode
    if (isFastEncodeEnabled) useFastEncode.trigger('click');

    isFastDecodeEnabled = $(this).prop('checked');

    if (isFastDecodeEnabled) ipc.on(Events.BROWSER_FOCUSED, fastDecode);
    else ipc.off(Events.BROWSER_FOCUSED, fastDecode);
  });

  // Get Encode
  ipc.on(Events.GET_ENCODED, (e, { data, error }) => {
    if (copyTextToClipboard) {
      // if input was empty
      if (!error) clipboard.writeText(data);

      copyTextToClipboard = false;
      return;
    }

    output.val(data);
  });

  // Get Decode
  ipc.on(Events.GET_DECODED, (e, { data, error }) => {
    if (copyTextToClipboard) {
      // If Non-UTF-8 Decoded Prevent Copy -> ""
      if (!error) clipboard.writeText(data);

      copyTextToClipboard = false;
      return;
    }

    input.val(data);
  });

  /** Fn */

  function encodeInputText() {
    const txt = $(this).val().toString();

    ipc.send(Events.REQUEST_ENCODE, txt);
  }

  function decodeInputText() {
    const txt = $(this).val().toString();

    ipc.send(Events.REQUEST_DECODE, txt);
  }

  async function fastEncode() {
    const data = await clipboard.readText();

    ipc.send(Events.REQUEST_ENCODE, data);

    copyTextToClipboard = true;
  }

  async function fastDecode() {
    const data = await clipboard.readText();

    ipc.send(Events.REQUEST_DECODE, data);

    copyTextToClipboard = true;
  }
});
