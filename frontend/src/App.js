import { Routes } from "./Routes";
import './_App.scss';
import { Login } from './Pages';
import { Header } from './Layouts';
import { useTheContext } from './TheProvider';


export const DotProduct=(vector1, vector2) =>{
  // Verificamos que los dos vectores tengan la misma longitud
  if (vector1.length !== vector2.length) {
      throw new Error("Los vectores deben tener la misma longitud.");
  }

  // Usamos map para multiplicar los elementos y reduce para sumar los productos
  return vector1
      .map((valor, index) => valor * vector2[index]) // Multiplica cada elemento correspondiente
      .reduce((acumulador, valor) => acumulador + valor, 0); // Suma los resultados
}

export const VerifyCodNit = (value) =>{
    const WeightDian = [71,67,59,53,47,43,41,37,29,23,19,17,13,7,3]
    let CodVe = value
    const digitList = Array.from(CodVe).filter(char => /\d/.test(char)).map(Number);
    // Completar digitList con ceros al principio para que tenga 15 entradas
    const filledDigitList = new Array(15 - digitList.length).fill(0).concat(digitList);
    const dot = DotProduct(filledDigitList, WeightDian)
    const result = 11-( dot % 11)
    //console.log(result)
    //setVerCod(result)
    return result
}

export const App = ()=> {
  //let logged = true
  const { logged, someData, setNItemsCart, setProductCodes, usD } = useTheContext();
  
  return (
    (!logged) ?
      <>
          <Login/>
      </>
      :
      <div>
          <Header />
          <Routes />
      </div>
    
  );
}
