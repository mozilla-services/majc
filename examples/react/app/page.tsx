import Article from './components/article/Article'
import NavBar from './components/navbar/Navbar'

export default function Home() {
  return (
    <main role="main">
      <div className="fixed w-full z-10">
        <NavBar />
      </div>
      <div className="flex flex-row pt-20 gap-10 pl-20">
        <div className="max-w-6xl">
          <Article />
        </div>
      </div>
    </main>
  )
}
