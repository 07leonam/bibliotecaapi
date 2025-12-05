const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./library.db', (err) => {
    if (err) console.error('Erro ao conectar:', err.message);
    else console.log('Conectado ao banco SQLite.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        ano INTEGER,
        tipo TEXT,
        quantidade INTEGER DEFAULT 1
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS alunos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE,
        matricula TEXT UNIQUE
    )`);

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

// --- ROTAS LIVROS ---
app.get('/livros', (req, res) => {
    db.all('SELECT * FROM livros', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/livros', (req, res) => {
    const { titulo, autor, ano, tipo, quantidade } = req.body;
    const sql = 'INSERT INTO livros (titulo, autor, ano, tipo, quantidade) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [titulo, autor, ano, tipo, quantidade], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, titulo, autor, ano, tipo, quantidade });
    });
});

app.put('/livros/:id', (req, res) => {
    const { titulo, autor, ano, tipo, quantidade } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE livros SET titulo = ?, autor = ?, ano = ?, tipo = ?, quantidade = ? WHERE id = ?';
    db.run(sql, [titulo, autor, ano, tipo, quantidade, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Livro atualizado!' });
    });
});

app.delete('/livros/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM livros WHERE id = ?', id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Livro removido!' });
    });
});

// --- ROTAS ALUNOS ---
app.get('/alunos', (req, res) => {
    db.all('SELECT * FROM alunos', [], (err, rows) => res.json(rows));
});

app.post('/alunos', (req, res) => {
    const { nome, email, matricula } = req.body;
    db.run('INSERT INTO alunos (nome, email, matricula) VALUES (?, ?, ?)', [nome, email, matricula], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, nome, email, matricula });
    });
});

app.delete('/alunos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM alunos WHERE id = ?', id, (err) => res.json({ message: 'Aluno removido!' }));
});

// --- ROTAS EMPRÉSTIMOS ---
app.get('/emprestimos', (req, res) => {
    const sql = `SELECT e.id, e.data_emprestimo, e.data_devolucao, 
                l.titulo as livro_titulo, a.nome as aluno_nome 
                FROM emprestimos e JOIN livros l ON e.livro_id = l.id JOIN alunos a ON e.aluno_id = a.id`;
    db.all(sql, [], (err, rows) => res.json(rows));
});

app.post('/emprestimos', (req, res) => {
    const { livro_id, aluno_id } = req.body;
        db.get('SELECT quantidade FROM livros WHERE id = ?', [livro_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Livro não encontrado' });
        if (row.quantidade <= 0) return res.status(400).json({ error: 'Livro sem estoque!' });

        db.serialize(() => {
            db.run('INSERT INTO emprestimos (livro_id, aluno_id) VALUES (?, ?)', [livro_id, aluno_id]);
            db.run('UPDATE livros SET quantidade = quantidade - 1 WHERE id = ?', [livro_id]);
            res.json({ message: 'Empréstimo realizado!' });
        });
    });
});

app.put('/emprestimos/:id/devolucao', (req, res) => {
    const { id } = req.params;
    db.get('SELECT livro_id FROM emprestimos WHERE id = ?', [id], (err, row) => {
        if (!row) return res.status(404).json({ error: 'Empréstimo não encontrado' });
        const livro_id = row.livro_id;

        db.serialize(() => {
            db.run('UPDATE emprestimos SET data_devolucao = CURRENT_TIMESTAMP WHERE id = ?', [id]);
            db.run('UPDATE livros SET quantidade = quantidade + 1 WHERE id = ?', [livro_id]);
            res.json({ message: 'Livro devolvido!' });
        });
    });
});

app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));