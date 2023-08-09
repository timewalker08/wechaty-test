// @ts-nocheck

import {
    Contact,
    Message,
    ScanStatus,
    WechatyBuilder,
    log,
} from 'wechaty'

import * as PUPPET from 'wechaty-puppet'

import qrcodeTerminal from 'qrcode-terminal'

import 'dotenv/config.js'

const bot = WechatyBuilder.build();


function onScan(qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('')
        log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

    } else {
        log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

function onLogin(user: Contact) {
    log.info('StarterBot', '%s login', user)
}

function onLogout(user: Contact) {
    log.info('StarterBot', '%s logout', user)
}

async function onMessage(msg: Message) {
    if (msg.type() === bot.Message.Type.Image) {
        const fileBox = await msg.toFileBox();
        const fileName = `${fileBox.name}.png`;
        await fileBox.toFile(fileName, true);
        console.log(`Image has been downloaded as ${fileName}`);
    }
}



bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e))