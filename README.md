# conFIEL

Powering CBDCs in Mexico using FIEL-derived custody wallets.

## Features

### Users
- [x] Upload FIEL files and parse them to obtain certificates and RFC information
- [x] Generate a `ECDSA` compatible `XRPL` wallet from `RSA` signature via `RFC1751`
- [x] Request to "Open Account" to "Bank" to derived `XRPL` wallet w/signature and `.cer`
- [x] Display whether their account is active or not based on fund from Bank
- [x] Provide the ability to transfer `0.05` `XRP` to any given address

### Bank
- [x] Visualize any request to "Open Account" from "User" or "Bank
- [x] "Open" an account by funding them with `15` `XRP` and making it "Active"
