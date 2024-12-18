import { Link } from "react-router-dom";

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
    <br />
      <div className='container text-center'>
        <h1>Simulador</h1>
        <hr />
      </div>
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div> */}
      <div className="container text-center">
        <Link className="btn btn-success" to={"/TodoList"}> Movimientos </Link>
        <p className="read-the-docs">
          <br />
          Bienvenido al simulador.
        </p>

        
      </div>
    </>
  )
}

export default App
