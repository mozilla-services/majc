# Logging and Telemetry

For everything logging related, we use our own `DefaultLogger` class which handles both console logging and emission of logs and telemetry data to external sources.

## Using the logger

To use the logger, simply import `DefaultLogger` and create a new instance of it where needed. It requires a `name` on init which should follow a `{packageName}.{fileName}.{class_if_applicable}` pattern. For example:
``` typescript
const logger = new DefaultLogger({
  name: 'core.fetch',
  logToConsole: true, // default set by LOG_TO_CONSOLE_FLAG_DEFAULT
  level: LoggerLevel.Info, // default is Info
  emitLogs: true // default is set by LOG_EMIT_FLAG_DEFAULT
})
```

Once initialized, you can log a message as you would with standard `.log('message1'), .info('message2'), .error('message3') ...` methods.


#### Additional Logging Parameters for Telemetry

In addition to a message, you can (and generally should) also hand it an additional `LogFields` object which will be used in formatting a log to be sent to external telemetry. This does not affect console logs.

```typescript
interface LogFields {
  type?: LogType // See log types below
  method?: LogMethods // HTTP method if applicable
  path?: string // HTTP endpoint used in a call if applicable
  placementId?: string // PlacementId when relevant
  errorId?: string // Some identifier for an error (if applicable). Generally Error.name
}
```

#### LogType Field

Below is a list of all log types we can emit and a description.

Info = :grey_question: | Warning = :warning: | Error = :exclamation:
<style scoped>
table {
  font-size: 12px;
}
</style>

| Package | Log Type | Severety | Description |
| ------- | -------- | :--------: | ----------- |
| core.instrument | logReporter.init.success | :grey_question: | The LogReporter has been initailized. This is the soonest a health check message can be sent and because LogReporter is a singleton, should only happen once per user session. This can be treated as an "init ping" |
| core.clicks | recordClick.clickOccurred | :grey_question: | A click occurred on an ad. Note: this happens regardless of the click callback URL request outcome |
| core.clicks | recordClick.callbackResponseError | :exclamation: | A non-200 response was returned from the click callback request |
| core.clicks | recordClick.callbackNotFoundError | :exclamation: | No click callback URL found for a given placement |
| core.display | renderPlacement.reportCallbackResponseError | :exclamation: | A non-200 response was returned from the report callback request |
| core.display | renderPlacement.reportCallbackNotFoundError | :exclamation: | No report callback URL found for a given placement |
| core.display | renderPlacement.reportCallbackInvalid | :exclamation: | An invalid report callback URL found for a given placement |
| core.fetch | fetchAds.request.error | :exclamation: | A non-200 response was returned from the getAds request |
| core.impressions | impressionObserver.recordImpression.viewed | :grey_question: | An impression as registered by the impressionObserver for a given placement. Note: this happens regardless of the callback URL request outcome |
| core.impressions | impressionObserver.recordImpression.callbackResponseError | :exclamation:  | A non-200 response was returned from the impression callback request |
| core.impressions | impressionObserver.recordImpression.callbackNotFoundError | :exclamation: | No report callback URL found for a given placement |
| core.impressions | impressionObserver.observeAd.adNotFoundError | :warning: | When trying to add a placement to the observer, the querySelector could not find an element with a matching placementId. This doesn't mean the ad won't be shown, but likely impression and click callbacks might fail. |
| core.impressions | impressionObserver.forceRecordImpression.error | :exclamation:  | When attempting to force an impression (usually as a result of a click before the view thresdhold is hit) the placementId could not be found |
| react.useMozAdsPlacement | placementComponent.adLoad.success | :grey_question:  | The MozAdsPlacement component loaded placement ad content successfully. |
| react.hooks.useMozAdsPlacement | placementComponent.adLoad.failure | :exclamation:  | The MozAdsPlacement component failed to fetch ads. |
| react.components.mozAdsPlacement | placementComponent.render.error | :exclamation:  | Some error occured during the rendering of the MozAdsPlacement componenSomething went wrong during the rendering of the MozAdsPlacement component. This likely implies that no ad was shown and we reverted to fallback content. |


### Log formatting

For our log format, we leverage a slightly modified version of [Firefox's Log Format](https://wiki.mozilla.org/Firefox/Services/Logging). Log formatting is handled automatically, during log emission.

```typescript
{
  Timestamp: 1519361465000000000,
  Type: 'fetchAds.request.error',
  Logger: 'majc.instrument.example',
  Hostname: 'somehost',
  EnvVersion: '0.1.0',
  Severity: 3, // Error = 3
  Pid: 1,
  Fields: {
    agent: 'curl/7.43.0',
    errorId: 'ExampleLogError',
    method: 'POST',
    msg: 'the user wanted to do something',
    path: '/v1/example/api/call',
    placementId: 'pocket_billboard_1',
    lang: 'en-us',
  },
```

Some unique things worth calling out is that we have explicitly removed the `uid` field as we want to be sure we *do not* save any kind of identifying information about a user in our logs.

We also include an additional `placementId` field which is useful to know if the log was associated with a particular ad placement.


### Emitting Telemetry

Currently, we do not send this full log externally. Instead, we are using a MARS endpoint for basic "counts" of events. These are represented by `eventLabel` in the log options. To emit logs, we simply make a `GET` request:

e.g. `/v1/log?event=render_error`

In this case, `event={eventLabel}`

The available eventLabels are as follows:
- init
- render_error
- ad_load_error
- fetch_error
- invalid_url_error

#### Rate limiting

Emitted logs are rate limited to prevent rapid refreshes or other unexpected client behavior from hurting page performance. By default, the rate limiter allows for up to two duplicate logs to be sent within a 2 second interval. Additional duplicate logs sent during this interval will be ignored and lost. Note that this does not affect console logs.

A duplicate log is defined as two logs with identical JSON (with the exception of the Timestamp field).

`Timestamp` is used to determine the time between logs for rate limiting purposes.
