/**
 *  +-+-+-+-+-+-+-+-+
 *  |M|a|K|3|r|D|^|0|  ~> ∞ & ⤼
 *  +-+-+-+-+-+-+-+-+
 *
 *  handcoded with 🤍 by 0xjO5i <0x@josi.io>
 */

import { configureApp } from "./app";

const port = process.env.APP_PORT || 3333;

configureApp().listen(port);

console.log(`Listening on port ${port}`);
