const express = require("express");
const bodyParser = require("body-parser");

const server = express(); // criando o servidor
const port = 3040;

let livros = [
  {
    id: 1,
    nomeLivro: "Ratatouille",
    capa: "capa.png",
    valor: 12,
    quatidade: 4,
  },
  {
    id: 2,
    nomeLivro: "A cabana",
    capa: "capa.png",
    valor: 14,
    quatidade: 2,
  },
  {
    id: 3,
    nomeLivro: "Arthur e a fabula logica",
    capa: "capa.png",
    valor: 20,
    quatidade: 2,
  },
  {
    id: 4,
    nomeLivro: "Arthur e a fabula logica",
    capa: "capa.png",
    valor: 20,
    quatidade: 2,
  },
  {
    id: 5,
    nomeLivro: "Saints Row: Uma lição de vida",
    capa: "capa.png",
    valor: 69,
    quatidade: 2,
  },
]; // lista de livros global
let livroAlugados = [];
let alunos = [
  {
    idA: 1,
    nome: "Rogerio",
  },
  {
    idA: 2,
    nome: "Ricardo",
  },
  {
    idA: 3,
    nome: "Mohammed ",
  },
];

server.use(bodyParser.json()); // definindo que o corpo das requisições será do tipo

server.listen(port, () => {
  // iniciando e escutando o servidor
  console.log(`Servidor rodando na porta: ${port}`);
});

server.get("/", (req, res) => {
  // mapeamento do método GET
  res.json({ mensagem: "Servidor dísponível" });
});

server.get("/livros", (req, res) => {
  // listar os livros do sistema
  res.json({ livros: livros });
});

server.post("/criar-livro", (req, res) => {
  // criar um novo livro
  livros.push(req.body);
  res.json({ mensagem: "Livro criado com sucesso!" });
});

server.delete("/deletar-livro/:id", (req, res) => {
  // deletar um livro
  livros = livros.filter((livro) => livro.id != req.params.id);
  res.json({ mensagem: "Livro removido com sucesso!" });
});

server.put("/atualizar-livro/:id", (req, res) => {
  // encontrar o livro pelo id e atualizar ou substituir suas informações
  let livroAtualizado = livros.find((livro) => livro.id == req.params.id);
  livroAtualizado = req.body;

  // encontrando o indice do livro e atualizando o objeto no array
  let indiceLivro = livros.findIndex((livro) => livro.id == req.params.id);
  livros[indiceLivro] = livroAtualizado;

  res.json({ mensagem: "Livro atualizado com sucesso!" });
});

server.post("/alugarLivro", (req, res, next) => {
  let quantidadeLivro = livroAlugados.filter(
    (livroAlugado) => livroAlugado.id == req.body.livro
  );

  let idLivro = req.body.livro;
  let idAluno = req.body.aluno;

  let livroEmp = livros.find((livro) => livro.id == idLivro);
  let alunoEmp = alunos.find((aluno) => aluno.idA == idAluno);

  if (quantidadeLivro.length < livroEmp.quatidade) {
    let infoLivro = Object.assign(livroEmp, alunoEmp);
    livroAlugados.push(infoLivro);

    res.send(
      "livro alugado! o livroi foi o " +
        livroEmp.nomeLivro +
        " pelo aluno " +
        alunoEmp.nome
    );
  } else {
    res.send("não temos mais livros deste disponiveis");
  }
});

server.get("/emprestimoLivro", (req, res, next) => {
  res.json({ livros: livroAlugados });
});

server.get("/valorTotalAluguel/:idA", (req, res, next) => {
  let valor = 0;
  let id = req.params.idA;

  for (let livroLocado of livroAlugados) {
    if (id == livroLocado.idA) {
      valor += livroLocado.valor;
    }
  }
  res.send({ ValorTotal: "R$" + valor });
});

server.post("/cadAluno", (req, res, next) => {
  alunos.push(req.body);
  res.status(201).send("aluno cadastrado com sucesso");
});

server.get("/viewAluno", (req, res, next) => {
  res.status(200).json(alunos);
});
