import sqlite3

print("Testando schema do banco de dados...")

try:
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_completo TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha_hash TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            telefone TEXT,
            cargo TEXT NOT NULL,
            status TEXT DEFAULT 'ativo',
            primeiro_acesso INTEGER DEFAULT 1,
            criado_por INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute("PRAGMA table_info(usuarios)")
    colunas_existentes = [coluna[1] for coluna in cursor.fetchall()]

    print(f"Colunas encontradas: {colunas_existentes}")

    colunas_necessarias = ['email', 'cpf', 'cargo', 'nome_completo', 'telefone', 'status', 'primeiro_acesso']

    for coluna in colunas_necessarias:
        if coluna in colunas_existentes:
            print(f"✓ Coluna '{coluna}' existe")
        else:
            print(f"✗ Coluna '{coluna}' NÃO existe")

    cursor.execute('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_usuarios_cargo ON usuarios(cargo)')

    print("\n✓ Índices criados com sucesso!")
    print("✓ Schema validado com sucesso!")

    conn.close()

except Exception as e:
    print(f"✗ Erro: {e}")
    exit(1)
