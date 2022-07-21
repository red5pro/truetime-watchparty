interface ISubscriberItemProps {
  streamName: any
  parent: any
  index: any
  requestLayoutFn: any
}

const SubscriberItem = (props: ISubscriberItemProps) => {
  const { streamName, parent, index, requestLayoutFn } = props

  const subscriptionId = [streamName, 'sub'].join('-')

  const subscriber = undefined
  const baseConfiguration = undefined
  const streamingMode = undefined
  const next = undefined

  const generateNewSubscriberDOM = () => {
    // var card = templateContent(subscriberTemplate);
    // parent.appendChild(card);
    // var videoId = getSubscriberElementId(streamName);
    // var videoElement = card.getElementsByClassName('red5pro-subscriber')[0];
    // var canvasElement = card.getElementsByClassName('detect-canvas')[0];
    // var subscriberNameField = card.getElementsByClassName('subscriber-name-field')[0];
    // var subscriberIdField = card.getElementsByClassName('subscriber-id-field')[0];
    // subscriberNameField.innerText = streamName;
    // subscriberIdField.innerText = '(' + subscriptionId + ')';
    // videoElement.id = videoId;
    // card.id = getSubscriberElementContainerId(streamName);
    // //    card.style.position = 'relative'
    // card.classList.add('video-card')
    // if (regex.exec(streamName)) {
    //   window.doDetect(videoElement, canvasElement)
    // } else {
    //   canvasElement.parentNode.removeChild(canvasElement)
    // }
    // return card
  }

  const card = generateNewSubscriberDOM()

  return <div>SubscriberItem</div>
}

export default SubscriberItem

// var SubscriberItem = function (subStreamName, parent, index, requestLayoutFn) {
//   this.subscriptionId = [subStreamName, 'sub'].join('-')
//   this.streamName = subStreamName
//   this.subscriber = undefined
//   this.baseConfiguration = undefined
//   this.streamingMode = undefined
//   this.index = index
//   this.next = undefined
//   this.parent = parent
//   this.requestLayoutFn = requestLayoutFn

//   this.card = generateNewSubscriberDOM(this.streamName, this.subscriptionId, this.parent)
//   this.statusField = this.card.getElementsByClassName('subscriber-status-field')[0]
//   this.handleStreamingModeMetadata = this.handleStreamingModeMetadata.bind(this)

//   if (this.card.querySelector('.name-field')) {
//     this.card.querySelector('.name-field').innerText = this.streamName
//   }

//   //    console.log('TEST', 'To UNdisposeDD ' + this.streamName)
//   this.resetTimout = 0
//   this.disposed = false
//   ConferenceSubscriberItemMap[this.streamName] = this

//   addLoadingIcon(this.card)
//   this.requestLayoutFn.call(null)
// }
// SubscriberItem.prototype.handleStreamingModeMetadata = function (streamingMode) {
//   this.streamingMode = streamingMode
// }
// SubscriberItem.prototype.respond = function (event) {
//   if (event.type === 'Subscribe.Time.Update') return

//   console.log('TEST', '[subscriber:' + this.streamName + '] ' + event.type)
//   const inFailedState = updateSuscriberStatusFromEvent(event, this.statusField)
//   if (event.type === 'Subscribe.Metadata') {
//     if (event.data.streamingMode) {
//       this.handleStreamingModeMetadata(event.data.streamingMode)
//     }
//   } else if (event.type === 'Subscriber.Play.Unpublish') {
//     this.dispose()
//   } else if (event.type === 'Subscribe.Connection.Closed') {
//     this.close()
//   } else if (event.type === 'Connect.Failure') {
//     this.reject()
//     this.close()
//   } else if (event.type === 'Subscribe.Fail') {
//     this.reject()
//     this.close()
//   } else if (event.type === 'Subscribe.Start') {
//     this.resolve()
//   }

//   if (inFailedState) {
//     this.close()
//   }
// }
// SubscriberItem.prototype.resolve = function () {
//   removeLoadingIcon(this.card)
//   if (this.next) {
//     console.log('TEST', new Date().getTime(), '[subscriber:' + this.streamName + '] next ->. ' + this.next.streamName)
//     this.next.execute(this.baseConfiguration)
//   }
// }
// SubscriberItem.prototype.reject = function (event) {
//   console.error(event)
//   removeLoadingIcon(this.card)
//   if (this.next) {
//     this.next.execute(this.baseConfiguration)
//   }
// }
// SubscriberItem.prototype.reset = function () {
//   clearTimeout(this.resetTimeout)
//   if (this.disposed) return

//   //    console.log('TEST', 'To !!disposeDD ' + self.disposed)
//   this.resetTimeout = setTimeout(() => {
//     clearTimeout(this.resetTimeout)
//     console.log('TEST', '[subscriber:' + this.streamName + '] retry.')
//     new SubscriberItem(this.streamName, this.parent, this.index, this.requestLayoutFn).execute(this.baseConfiguration)
//   }, 2000)
// }
// SubscriberItem.prototype.dispose = function () {
//   //    console.log('TEST', 'To dispose ' + this.streamName)
//   clearTimeout(this.resetTimeout)
//   this.disposed = true
//   this.close()
// }
// SubscriberItem.prototype.close = function () {
//   if (this.closeCalled) return

//   this.closeCalled = true

//   const cleanup = () => {
//     const el = document.getElementById(getSubscriberElementId(this.streamName) + '-container')
//     if (el) {
//       el.parentNode.removeChild(el)
//     }
//     this.statusField.innerText = 'CLOSED'
//     if (!this.disposed) {
//       this.reset()
//     } else {
//       console.log('TEST', 'To disposeDD ' + this.streamName)
//       delete ConferenceSubscriberItem[this.streamName]
//       delete subscriberMap[this.streamName]
//     }
//     this.requestLayoutFn()
//   }
//   if (this.subscriber) {
//     this.subscriber.off('*', this.respond)
//     this.subscriber.unsubscribe().then(cleanup).catch(cleanup)
//   }
// }
// SubscriberItem.prototype.execute = async function (config) {
//   addLoadingIcon(this.card)
//   this.unexpectedClose = true

//   this.baseConfiguration = config
//   const self = this
//   const name = this.streamName
//   const uid = Math.floor(Math.random() * 0x10000).toString(16)
//   const rtcConfig = Object.assign({}, config, {
//     streamName: name,
//     subscriptionId: [this.subscriptionId, uid].join('-'),
//     mediaElementId: getSubscriberElementId(name),
//   })

//   try {
//     this.subscriber = new red5prosdk.RTCSubscriber()
//     this.subscriber.on('*', (e) => this.respond(e))

//     await this.subscriber.init(rtcConfig)
//     subscriberMap[name] = this.subscriber
//     self.requestLayoutFn.call(null)
//     await this.subscriber.subscribe()
//   } catch (error) {
//     console.log('[subscriber:' + name + '] Error')
//     self.reject(error)
//   }
// }
