import { test } from 'node:test'
import assert from 'node:assert/strict'
import { canAdvance, canCancel } from './orderFlow.js'

test('advances one legal step forward', () => {
  assert.ok(canAdvance('received', 'accepted'))
  assert.ok(canAdvance('accepted', 'preparing'))
  assert.ok(canAdvance('preparing', 'ready'))
  assert.ok(canAdvance('ready', 'completed'))
})

test('cannot skip steps or go backwards', () => {
  assert.ok(!canAdvance('received', 'preparing')) // skip
  assert.ok(!canAdvance('received', 'ready')) // skip
  assert.ok(!canAdvance('preparing', 'accepted')) // backwards
  assert.ok(!canAdvance('completed', 'ready')) // terminal
})

test('cancellable only before ready', () => {
  assert.ok(canCancel('received'))
  assert.ok(canCancel('accepted'))
  assert.ok(canCancel('preparing'))
  assert.ok(!canCancel('ready'))
  assert.ok(!canCancel('completed'))
  assert.ok(!canCancel('cancelled'))
})
