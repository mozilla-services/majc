# QAing the MAJC gpp module

## Setup
1. Add a new line to your /etc/hosts file: `127.0.0.1       localhost.example-domain.com`
2. Visit http://localhost.example-domain.com:8080/examples/iife/
3. If you are getting "secure connection"/https errors, we only know how to get past this in Chrome. Use Chrome and go to chrome://net-internals/#hsts
4. Input 'example-domain.com' into the last form field for "Delete domain security policies" and hit "Delete"
5. Load http://localhost.example-domain.com:8080/examples/iife/ in the browser

## Test with real GPP bundle. Verifies the behavior when GPP is enabled on the domain.
1. Delete domain security policies for example-domain.com. Clear all storage data and cookies.
2. Set the code to use the real bundle and real production placements. Real bundle script tag snippet:
```js
<script src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js" type="text/javascript" charset="UTF-8"
    data-domain-script="0198ae37-ce9e-7da0-b98e-269bd00d6e36"></script>
````

The MAJC GPP module waits for 200ms before making an ads request to see if a GPP bundle from OneTrust will load.
If not, it will default the GPP string to ""
Ad requestions should include a `gpp` param that's either set to an encoded value from OneTrust or "".

To adjust the 200ms to be longer, to makei it easier to verify the wait behavior run this snippet in the browser console: `mozAds.setConfigValue('gppReadyTimeout', 2000);`


### Test first run
  1. Load example plage
  2. Expect to see an ad request go out after 200ms with blank GPP string
### Test reject all
  - Clear all storage
  - Reload example page
  - Expect to see an ad request go out right away (~40-100ms) with the default, which is "reject" GPP string value `DBABBg~BUUAAACA.YA`
  - Select "Reject all" from the cookie footer
  - Reload example page
  - Expect to see an ad request go out right away  (~40-100ms) with "reject" GPP string value `DBABBg~BUUAAACA.YA`
### Test accept all
  - Clear all storage
  - Reload example page
  - Expect to see an ad request go out right away with the default, which is "reject" GPP string value `DBABBg~BUUAAACA.YA`
  - Select "Accept all" from the cookie footer
  - Reload example page
  - Expect to see an ad request go out right away with "accept" GPP string value `DBABBg~BUoAAACA.YA`

## Test without any bundle. Verifies the behavior when GPP is not enabled on the domain.
1. Delete domain security policies for example-domain.com. Clear all storage data and cookies.
2. Set the code to use no bundle and real production ad placements
3. Load the example page
  - Expect to see an ad request go out after 200ms with blank GPP string
