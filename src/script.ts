const or_else = function<A>(maybe : A | null, f : () => A) : A {
  return maybe === null ? f() : maybe;
}
const panic = (s : String) => {
  return () => {
    console.log(s)
    process.exit(1)
  }
}

const unwrap = function<A>(maybe : A | null, err? : String) : A {
  return or_else(maybe, panic(err !== undefined ? err : "failed to unwrap"))
}

const all = (x : Array<Boolean>) : Boolean => {
  return x.reduce((acc, v) => acc && v, true)
}

const table = unwrap(document.getElementById("main"), "failed to get element")
const congratz = unwrap(document.getElementById("congratz"), "failed to get element")


enum CellValue {
  O, X, Empty
}

enum Turn {
  X, O
}

const state = Array.from({length : 3}, _ => Array.from({length : 3}, _ => CellValue.Empty))
let turn = Turn.X;
let ids: HTMLElement[][] = []




const check_win = function(i : number, j : number, value : CellValue) : Array<[number, number]> {
  const cells_are_equal = ([j, i]: [number, number]) => state[j][i] === value
  
  const line : Array<[number, number]> = Array.from({length : 3}, (_, k) => [j, k])
  const column : Array<[number, number]> = Array.from({length : 3}, (_, k) => [k, i])
  const diag : Array<[number, number]> = Array.from({length : 3}, (_, i) => [i, i])
  const pdiag : Array<[number, number]> = Array.from({length : 3}, (_, i) => [i, 2-i])
  console.log(line);
  if (all(line.map(cells_are_equal))) {
    return line;
  } else if (all(column.map(cells_are_equal))) {
    return column;
  } else if (all(diag.map(cells_are_equal))) {
    return diag;
  } else if (all(pdiag.map(cells_are_equal))) {
    return pdiag;
  } else  {
    return []
  }
}

const manage_click = function(i : number, j : number, data : HTMLElement) {
  if (state[j][i] !== CellValue.Empty) {
    return;
  }
  const thisturn = turn;
  [turn, data.textContent, state[j][i]] =
    (turn === Turn.X)
      ? [Turn.O, "X", CellValue.X]
      : [Turn.X, "O", CellValue.O]
  
  const win = check_win(i, j, state[j][i])
  if (win.length !== 0) {
    congratz.textContent = `${Turn[thisturn]} wins!`
    congratz.hidden = false;
    win.forEach(pair => {
      const [j, i] = pair;
      console.log(pair)
      ids[j][i].classList.remove("square-inactive", "square-active")
      ids[j][i].classList.add("square-victory")
    })
  }

  const end = all(state.map(line => all(line.map(x => x !== CellValue.Empty))));
  if (end) {
    congratz.textContent = "Empate, não é possível fazer mais movimentos!"
    congratz.hidden = false;
  }
}

const reset = function() {
  congratz.hidden = true;
  for(let j = 0; j < 3; j++) {
    for(let i = 0; i < 3; i++) {
      ids[j][i].textContent = ""
      ids[j][i].classList.remove('square-victory')
      ids[j][i].classList.add('square-inactive')
      state[j][i] = CellValue.Empty
    }
  }
}

const setup = function() {
  congratz.hidden = true;
  congratz.addEventListener("click", () => reset())
  for(let j = 0; j < 3; j++) {
    const line = document.createElement("tr")
    let idline = []
    for(let i = 0; i < 3; i++) {
      const data = document.createElement("td")
      idline.push(data);
      data.classList.add("square", "square-inactive")
      if (i < 2) {
        data.classList.add("square-border-right")
      } 
      if (i > 0) {
        data.classList.add("square-border-left")
      }

      if (j < 2) {
        data.classList.add("square-border-down")
      }
      if (j > 0) {
        data.classList.add("square-border-top")
      }

      data.addEventListener("mouseenter", _ => {
        data.classList.remove("square-inactive")
        data.classList.add("square-active")
      })
      data.addEventListener("mouseleave", _ => {
        data.classList.remove("square-active")
        data.classList.add("square-inactive")
      })
      data.addEventListener("click", _ => manage_click(i, j, data))

      line.appendChild(data)
    }
    ids.push(idline)
    table.appendChild(line)
  }
}

setup()






//el.textContent = "Hello"
//el.style.backgroundColor = "gray"

