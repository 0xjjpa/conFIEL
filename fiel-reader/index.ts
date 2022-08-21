import * as fs from "fs";
import { Credential } from '@nodecfdi/credentials';
// se puede mandar el path o el contenido
const certFile = fs.readFileSync('fiel/certificado.cer', 'binary');
const keyFile = fs.readFileSync('fiel/privatekey.key', 'binary');
console.log("CERT", certFile);
console.log("KEY", keyFile);
const passPhrase = '12345678a'; // contraseña para abrir la llave privada
const fiel = Credential.create(certFile, keyFile, passPhrase);
const sourceString = 'texto a firmar';
// alias de privateKey/sign/verify
const signature = fiel.sign(sourceString);
console.log(signature);
// alias de certificado/publicKey/verify
const verify = fiel.verify(sourceString, signature);
console.log(verify); // boolean(true)
// objeto certificado
const certificado = fiel.certificate();
console.log(certificado.rfc()); // el RFC del certificado
console.log(certificado.legalName()); // el nombre del propietario del certificado
console.log(certificado.branchName()); // el nombre de la sucursal (en CSD, en FIEL está vacía)
console.log(certificado.serialNumber().bytes()); // número de serie del certificado