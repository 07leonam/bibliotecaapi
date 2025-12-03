const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Permite que o Vue acesse a API
app.use(express.json());

// Conexão com Banco de Dados (Cria o arquivo library.db na raiz)
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criação das Tabelas (Inicialização)
db.serialize(() => {
    // Tabela Livros
    db.run(`CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        ano INTEGER,
        disponivel INTEGER DEFAULT 1
    )`);

    // Tabela Alunos
    db.run(`CREATE TABLE IF NOT EXISTS alunos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE,
        matricula TEXT UNIQUE
    )`);

    // Tabela Empréstimos
    db.run(`CREATE TABLE IF NOT EXISTS emprestimos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        livro_id INTEGER,
        aluno_id INTEGER,
        data_emprestimo DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_devolucao DATETIME,
        FOREIGN KEY(livro_id) REFERENCES livros(id),
        FOREIGN KEY(aluno_id) REFERENCES alunos(id)
    )`);
});

// Rota de Teste
app.get('/', (req, res) => {
    res.json({ message: "API da Biblioteca funcionando!" });
});

// --- ROTAS DE LIVROS ---

// 1. Listar todos os livros (READ)
app.get('/livros', (req, res) => {
    db.all('SELECT * FROM livros', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 2. Cadastrar novo livro (CREATE)
app.post('/livros', (req, res) => {
    const { titulo, autor, ano } = req.body;
    const sql = 'INSERT INTO livros (titulo, autor, ano) VALUES (?, ?, ?)';
    
    // Usamos function normal aqui para ter acesso ao 'this.lastID'
    db.run(sql, [titulo, autor, ano], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ 
            id: this.lastID, 
            titulo, 
            autor, 
            ano, 
            disponivel: 1 
        });
    });
});

// 3. Editar livro (UPDATE)
app.put('/livros/:id', (req, res) => {
    const { titulo, autor, ano } = req.body;
    const { id } = req.params;
    
    const sql = 'UPDATE livros SET titulo = ?, autor = ?, ano = ? WHERE id = ?';
    
    db.run(sql, [titulo, autor, ano, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        res.json({ message: 'Livro atualizado com sucesso!', id, titulo, autor, ano });
    });
});

// 4. Deletar livro (DELETE)
app.delete('/livros/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM livros WHERE id = ?';
    
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Livro não encontrado' });
        }
        res.json({ message: 'Livro removido com sucesso!' });
    });
});

// --- ROTAS DE ALUNOS ---

// Listar alunos
app.get('/alunos', (req, res) => {
    db.all('SELECT * FROM alunos', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Cadastrar aluno
app.post('/alunos', (req, res) => {
    const { nome, email, matricula } = req.body;
    const sql = 'INSERT INTO alunos (nome, email, matricula) VALUES (?, ?, ?)';
    db.run(sql, [nome, email, matricula], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, nome, email, matricula });
    });
});
//atualizar
app.put('/alunos/:id', (req, res) => {
    const { nome, email, matricula } = req.body;
    const { id } = req.params;

    const sql = 'UPDATE alunos SET nome = ?, email = ?, matricula = ? WHERE id = ?';
    
    db.run(sql, [nome, email, matricula, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: 'Aluno não encontrado' });
        res.json({ message: 'Aluno atualizado!', id, nome, email, matricula });
    });
});

// Deletar aluno
app.delete('/alunos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM alunos WHERE id = ?', id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Aluno removido com sucesso!' });
    });
});

// --- ROTAS DE EMPRÉSTIMOS ---

// Listar empréstimos (Trazendo dados do Livro e do Aluno junto - JOIN)
app.get('/emprestimos', (req, res) => {
    const sql = `
        SELECT e.id, e.data_emprestimo, e.data_devolucao, 
               l.titulo as livro_titulo, l.autor as livro_autor,
               a.nome as aluno_nome
        FROM emprestimos e
        JOIN livros l ON e.livro_id = l.id
        JOIN alunos a ON e.aluno_id = a.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Criar empréstimo (Saída do livro)
app.post('/emprestimos', (req, res) => {
    const { livro_id, aluno_id } = req.body;

    // 1. Verificar se o livro está disponível
    db.get('SELECT disponivel FROM livros WHERE id = ?', [livro_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Livro não encontrado' });
        if (row.disponivel === 0) return res.status(400).json({ error: 'Livro já emprestado!' });

        // 2. Se disponível, cria o empréstimo e atualiza o livro
        db.serialize(() => {
            db.run('INSERT INTO emprestimos (livro_id, aluno_id) VALUES (?, ?)', [livro_id, aluno_id]);
            db.run('UPDATE livros SET disponivel = 0 WHERE id = ?', [livro_id]);
            res.json({ message: 'Empréstimo realizado com sucesso!' });
        });
    });
});

// Realizar Devolução (Entrada do livro)
app.put('/emprestimos/:id/devolucao', (req, res) => {
    const { id } = req.params; // ID do empréstimo

    // 1. Busca o ID do livro associado a este empréstimo
    db.get('SELECT livro_id FROM emprestimos WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Empréstimo não encontrado' });
        
        const livro_id = row.livro_id;

        // 2. Atualiza a data de devolução e libera o livro
        db.serialize(() => {
            db.run('UPDATE emprestimos SET data_devolucao = CURRENT_TIMESTAMP WHERE id = ?', [id]);
            db.run('UPDATE livros SET disponivel = 1 WHERE id = ?', [livro_id]);
            res.json({ message: 'Livro devolvido com sucesso!' });
        });
    });
});


// Iniciar Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});