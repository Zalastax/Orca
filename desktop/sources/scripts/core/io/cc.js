'use strict'

let bank_select = 0
let modulation = 1
let portamento_time = 5
let portamento = 65
let data_entry = 6
let volume = 7
let panpot = 10
let expression = 11
let hold_1 = 64
let attack_time = 73
let decay_time = 75
let release_time = 72
let cutoff = 74
let resonance = 71
let vibrato_rate = 76
let vibrato_depth = 77
let vibrato_delay = 78
let reverb_send_level = 91
let delay_send_level = 94

const ccMapping = [
  1,  // 0 = modulation
  5,  // 1 = portamento time
  65, // 2 = portamento
  7,  // 3 = volume
  10, // 4 = panpot
  11, // 5 = expression
  64, // 6 = hold_1
  73, // 7 = attack time
  75, // 8 = decay time
  72, // 9 = release time
  74, // a = cutoff
  71, // b = resonance
  76, // c = vibrato rate
  77, // d = vibrato depth
  78, // e = vibrato delay
  91, // f = reverb send level
  94, // g = delay send level
  99, // h
  99, // i
  99, // j
  99, // k
  99, // l
  99, // m
  99, // n
  99, // o
  99, // p
  99, // q
  99, // r
  99, // s
  99, // t
  99, // u
  99, // v
  99, // w
  99, // x
  99, // y
  99, // z
]

function MidiCC (client) {
  this.stack = []
  this.offset = 64

  this.start = function () {
    console.info('MidiCC', 'Starting..')
  }

  this.clear = function () {
    this.stack = []
  }

  this.run = function () {
    if (this.stack.length < 1) { return }
    const device = client.io.midi.outputDevice()
    if (!device) { console.warn('CC', 'No Midi device.'); return }
    for (const msg of this.stack) {
      if (msg.type === 'cc' && !isNaN(msg.channel) && !isNaN(msg.knob) && !isNaN(msg.value)) {
        device.send([0xb0 + msg.channel, ccMapping[msg.knob], msg.value])
      } else if (msg.type === 'pb' && !isNaN(msg.channel) && !isNaN(msg.lsb) && !isNaN(msg.msb)) {
        device.send([0xe0 + msg.channel, msg.lsb, msg.msb])
      } else if (msg.type === 'pg' && !isNaN(msg.channel)) {
        if (!isNaN(msg.bank)) { device.send([0xb0 + msg.channel, 0, msg.bank]) }
        if (!isNaN(msg.sub)) { device.send([0xb0 + msg.channel, 32, msg.sub]) }
        if (!isNaN(msg.pgm)) { device.send([0xc0 + msg.channel, msg.pgm]) }
      } else {
        console.warn('CC', 'Unknown message', msg)
      }
    }
  }

  this.setOffset = function (offset) {
    if (isNaN(offset)) { return }
    this.offset = offset
    console.log('CC', 'Set offset to ' + this.offset)
  }
}
