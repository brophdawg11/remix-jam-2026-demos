import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { debounce } from './debounce.ts'

describe('debounce', () => {
  it('waits until the delay after the last call and uses its arguments', (t) => {
    let timers = t.useFakeTimers()
    let calls: Array<[string, number]> = []
    let update = debounce((query: string, page: number) => calls.push([query, page]), 200)

    update('engine', 1)
    timers.advance(150)
    update('tires', 2)
    timers.advance(199)
    assert.deepEqual(calls, [])
    timers.advance(1)
    assert.deepEqual(calls, [['tires', 2]])
    timers.advance(200)
    assert.equal(calls.length, 1)
  })

  it('cancels a pending call and can be scheduled again', (t) => {
    let timers = t.useFakeTimers()
    let calls = 0
    let update = debounce(() => calls++, 200)

    update()
    update.cancel()
    update.cancel()
    timers.advance(200)
    assert.equal(calls, 0)

    update()
    timers.advance(200)
    assert.equal(calls, 1)
  })

  it('keeps separate debounced callbacks independent', (t) => {
    let timers = t.useFakeTimers()
    let calls: string[] = []
    let first = debounce(() => calls.push('first'), 200)
    let second = debounce(() => calls.push('second'), 200)

    first()
    second()
    first.cancel()
    timers.advance(200)
    assert.deepEqual(calls, ['second'])
  })

  it('cancels a pending call on abort and ignores later calls', (t) => {
    let timers = t.useFakeTimers()
    let controller = new AbortController()
    let calls = 0
    let update = debounce(() => calls++, 200, controller.signal)

    update()
    timers.advance(100)
    controller.abort()
    timers.advance(200)
    assert.equal(calls, 0)

    update()
    timers.advance(200)
    assert.equal(calls, 0)
  })

  it('ignores calls when the signal is already aborted', (t) => {
    let timers = t.useFakeTimers()
    let calls = 0
    let update = debounce(() => calls++, 200, AbortSignal.abort())

    update()
    timers.advance(200)
    assert.equal(calls, 0)
  })

  it('can be canceled and rescheduled while the signal is active', (t) => {
    let timers = t.useFakeTimers()
    let controller = new AbortController()
    let calls = 0
    let update = debounce(() => calls++, 200, controller.signal)

    update()
    update.cancel()
    timers.advance(200)
    assert.equal(calls, 0)

    update()
    timers.advance(199)
    assert.equal(calls, 0)
    timers.advance(1)
    assert.equal(calls, 1)
    controller.abort()
  })
})
