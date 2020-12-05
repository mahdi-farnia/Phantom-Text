const { ipcRenderer: ipc } = require('electron');
const { join: joinPath } = require('path');
const Events = require(joinPath(__dirname, '../modules/Events.js'));
// const { clipboard } = navigator;

$(() => {
  const input = $('#encode_field');
  const output = $('#output_field');

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

  // Write to output
  ipc.on(Events.GET_ENCODED, (e, data) => {
    output.val(data);
  });

  // write data to input
  ipc.on(Events.GET_DECODED, (e, data) => {
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

  // Encode/Decode Clipboard Data On App Actiavte And Copy It
  async function fastEncode() {
    // const data = await clipboard.readText();
    // clipboard.writeText(encoder.encode(data).toString());
  }

  async function fastDecode() {
    // const txt = await clipboard.readText();
    // clipboard.writeText(decodeText(txt));
  }
});
