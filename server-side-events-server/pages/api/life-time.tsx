import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import CryptoJS from "crypto-js";

export const runtime = 'edge';

const ChewyRegular = fetch(
    new URL('../../public/assets/fonts/Chewy-Regular.ttf', import.meta.url).toString(), 
).then(res => res.arrayBuffer());

var key = CryptoJS.enc.Utf8.parse("93wj660t8fok9jws");
var iv = CryptoJS.enc.Utf8.parse("r0yy7e67p49ee4d7");

const decrypt = (encryptedText: string) => {
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64url.parse(encryptedText),
    });
    return CryptoJS.AES.decrypt(cipherParams, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    }).toString(CryptoJS.enc.Utf8);
};

export default async function GET(request: NextRequest) {
    const chewyRegularFont = await ChewyRegular
    const { searchParams } = new URL(request.url);
    const gente = searchParams.get('gente');
    let name = 'scott', birthDate;
    let days = 0, hours = 0, minutes = 0, seconds = 0;

    // fetch and decode the hash
    if (gente) {
        try {
            const decoded = decrypt(gente);

            const { username, userBirthDate } = JSON.parse(decoded);
            name = username;
            birthDate = userBirthDate;

            const birthDateTime = new Date(birthDate);
            const now = new Date();
            let lifetime = now.getTime() - birthDateTime.getTime();

            days = lifetime ? Math.floor(lifetime / (1000 * 60 * 60 * 24)) : 0

            hours = lifetime
                ? Math.floor((lifetime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                : 0

            minutes = lifetime
                ? Math.floor((lifetime % (1000 * 60 * 60)) / (1000 * 60))
                : 0

            seconds = lifetime ? Math.floor((lifetime % (1000 * 60)) / 1000) : 0


        } catch (error) {
            console.error("Error decoding hash:", error);
        }
    }

    return new ImageResponse(
        <div tw="h-full w-full flex flex-col items-center bg-white text-2xl font-bold text-[#fff]"
            style={{
                backgroundImage: `url("https://www.test-free.online/og-bg.png")`,
                backgroundSize: "100%"
            }}
        >
            <h1 tw='font-Chewy-Regular text-[25] mt-40'>{name} has lived for</h1>
            <div
                tw="flex flex-row text-center justify-center text-white mt-7"
            >
                <div tw="flex flex-col mx-9 text-4xl">
                    <span tw="font-mono text-[21] text-[#fff]">{days}</span>
                    <span tw="text-[#fff] mx-auto">days</span>
                </div>
                <div tw="flex flex-col mx-9 text-4xl">
                    <span tw="font-mono text-[21]">{hours}</span>
                    <span tw="text-[#fff] mx-auto">hours</span>
                </div>
                <div tw="flex flex-col mx-9 text-4xl">
                    <span tw="font-mono text-[21]">{minutes}</span>
                    <span tw="text-[#fff] mx-auto">min</span>
                </div>
                <div tw="flex flex-col mx-9 text-4xl">
                    <span tw="font-mono text-[21]">{seconds}</span>
                    <span tw="text-[#fff] mx-auto">sec</span>
                </div>
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Chewy-Regular',
                    data: chewyRegularFont,
                    style: 'normal',
                },
            ],
        }
    );
}