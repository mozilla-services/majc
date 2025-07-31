"use client"

declare const __gpp: (command: string, callback: (data: unknown, success: boolean) => void) => void

export default function NavBar() {
  return (
    <div className="flex flex-row h-14 justify-between items-center px-10 shadow-lg bg-white">
      <div>
        Lorem Ipsum
      </div>
      <div>
        Top Bar
      </div>
      <div>
        <button onClick={() => __gpp("ping", data => console.log(data))}>Log GPP Ping</button>
        &nbsp;&nbsp;
        <button id="ot-sdk-btn" className="ot-sdk-show-settings">Cookie Settings</button>
      </div>
    </div>
  )
}
