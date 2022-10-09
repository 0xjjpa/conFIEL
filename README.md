# conFIEL

Powering CBDCs in Mexico using FIEL-derived custody

##Inspiration
Key management is a complex topic to handle for any individual trying to get into the digital asset ecosystem. Everybody has seen in the news stories about people losing thousands of money by getting their keys lost or stolen.

What if we could leverage existing infrastructure to onboard individuals to the next financial revolution? What if they never have to worry about what a blockchain private key is?

## What it does
conFIEL is an infrastructure project focused in the Mexican market that showcases how easy is to onboard users into the XRP Ledger ecosystem by using the over 30 million deployed digital signatures used by the Tax Revenue Service in Mexico ("SAT"). Via conFIEL, any user already reporting their taxes to the Mexican government, has everything needed to get a digital wallet ready to use with XRP Ledger.

## How we built it
We leveraged the standard RFC1751 to provide existing RSA-2048 private keys with the ability to use a signed message as a derivation path for an XRP Ledger. Additionally, we created a small UI to showcase the workflow and how this derived wallet can be used to transfer value in the XRP Ledger.

## How to test it
Go to http://omawww.sat.gob.mx/tramitesyservicios/Paginas/certificado_sello_digital.htm and download the set of sample certificates issued by the SAT (select "(383 KB) Certificados de Prueba"). Unzip the contents in a directory you can reach. Go to https://con-fiel.vercel.app/demo and select any "Persona Fisica" and pick the ".key" and ".cer" file in the same folder. The password is "12345678a" for all keys.

**Important: If you type the wrong password, an error will be shown in the demo. Please refresh to restart the process from the beginning.**

## Challenges we ran into
As most digital wallets, the wallets use by XRP Ledger rely on the popular digital signature algorithm ECDSA. RSA private keys do not share the same signing properties as those used by elliptic curve-based signing algorithms. We had to explore options on deriving a meaningful amount of private data (to avoid collisions) while still being able to have a deterministic XRP wallet that could be used multiple times.

## Accomplishments that we're proud of
The derivation strategy for XRP ledgers is similar to existing L2 solutions in the blockchain ecosystem, but not many have explored using RSA or similar keys. It's always easier to use the newest and "coolest" cryptographic primitives in the market (e.g. EdDSA), but being able to use "old" private keys which is most of the time already deployed by the millions in multiple countries’ infrastructure, is something we are proud of.

## What we learned
XRP Ledger's native ability to have multi-sig transactions and very low fees is quite interesting. Within the context of CBDC is quite important to be able to "freeze" assets while still allowing P2P transactions. It would not be hard to implement an entire bank backoffice system that deploys accounts for users as multi-sigs with a signing key given to the bank. Whenever an account fails KYC/AML/PEP checks, the signing key could be frozen, ensuring the assets do not leave the multi-sig wallet. This ability is not usual and possible in other ecosystem due how expensive is to deploy a multi-sig (e.g. Ethereum).

## What's next for conFIEL
We are looking to expand the software in the following capacities:

- **Public sector**. Start a discussion with local authorities to identify potential uses cases of the technology considering the nature of the application and its ability to power digital transactions on the context of taxes, a difficult topic in Mexico.
- **Retail**. Develop conFIEL as a retail-focused application where consumers can start identifying the benefits of being able to use their digital ID for something more than paying taxes.
- **Private sector**. Expand conFIEL for ecommerce and other online digital business to combat fraudulent transactions and provide it as a KYC tool for businesses in Mexico.
