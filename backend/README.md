# Backend MacroVision

API Flask para análise dimensional usando visão computacional.

## Estrutura

```
backend/
├── app.py                  # Servidor Flask principal
├── camera_service.py       # Serviço de detecção de câmeras
├── measurement_service.py  # Serviço de medição dimensional
├── requirements.txt        # Dependências Python
├── start.bat              # Script de inicialização (Windows)
└── static/
    └── images/            # Imagens capturadas (gerado automaticamente)
```

## Instalação Rápida

### 0. Entrar no diretório (caso não esteja)
```bash
cd backend
```

### 1. Criar ambiente virtual
```bash
python -m venv venv
```

### 2. Ativar ambiente virtual

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

### 3. Instalar dependências
```bash
pip install -r requirements.txt
```

### 4. Iniciar servidor
```bash
python app.py
```

Ou use o script auxiliar (Windows):
```bash
start.bat
```

## API Endpoints

### 1. Status do Servidor
```
GET /api/status
```

**Resposta:**
```json
{
  "status": "online",
  "message": "Backend MacroVision está funcionando"
}
```

---

### 2. Listar Câmeras
```
GET /api/cameras
```

**Resposta:**
```json
{
  "success": true,
  "cameras": [
    {
      "id": 0,
      "name": "Camera 0",
      "resolution": "640x480"
    }
  ],
  "count": 1
}
```

---

### 3. Testar Câmera
```
GET /api/cameras/{camera_id}/test
```

**Resposta:**
```json
{
  "success": true,
  "message": "Câmera 0 conectada e funcionando corretamente"
}
```

---

### 4. Executar Análise
```
POST /api/analyze
Content-Type: application/json

{
  "camera_id": 0,
  "reference_width": 10.0,
  "num_captures": 8
}
```

**Resposta (Sucesso):**
```json
{
  "success": true,
  "message": "Análise concluída com 8 medições válidas",
  "measurements": {
    "width": 8.5,
    "height": 12.3,
    "length": 12.3
  },
  "images": [
    "analysis_20250118_123045_0.jpg",
    "analysis_20250118_123045_7.jpg"
  ],
  "num_valid_captures": 8
}
```

**Resposta (Falha):**
```json
{
  "success": false,
  "message": "Nenhuma medição válida foi obtida",
  "measurements": null,
  "images": []
}
```

---

### 5. Servir Imagem
```
GET /api/images/{filename}
```

Retorna a imagem como arquivo estático.

---

### 6. Limpar Imagens
```
DELETE /api/images
```

Remove todas as imagens salvas no servidor.

**Resposta:**
```json
{
  "success": true,
  "message": "10 imagens removidas"
}
```

## Configurações

### Alterar largura de referência padrão

Em `measurement_service.py`:
```python
def __init__(self, camera_id, reference_width_cm=10.0, num_captures=8):
```

### Alterar número de capturas padrão

No mesmo local, ajuste `num_captures`.

### Alterar porta do servidor

Em `app.py`, última linha:
```python
app.run(debug=True, port=5000, host='0.0.0.0')
```

### Alterar diretório de imagens

Em `app.py`:
```python
STATIC_FOLDER = 'static/images'
```

## Solução de Problemas

### Erro: "No module named 'flask'"

**Solução:** Certifique-se de que o ambiente virtual está ativado e as dependências estão instaladas:
```bash
venv\Scripts\activate
pip install -r requirements.txt
```

### Erro: "Não foi possível acessar a câmera"

**Possíveis causas:**
1. Câmera não está conectada
2. Outra aplicação está usando a câmera
3. Permissões de câmera bloqueadas

**Solução:** 
- Feche outros programas que usam a câmera (Zoom, Teams, etc.)
- Verifique permissões do Windows
- Teste com diferentes índices de câmera (0, 1, 2...)

### Erro: "Address already in use"

**Causa:** Porta 5000 já está em uso.

**Solução:** 
1. Pare o servidor anterior (Ctrl+C)
2. Ou mude a porta em `app.py`

### Análise retorna "Nenhuma medição válida"

**Possíveis causas:**
1. Iluminação inadequada
2. Objeto de referência não visível
3. Objetos muito pequenos ou grandes

**Solução:**
- Melhore a iluminação
- Posicione objetos claramente visíveis
- Ajuste parâmetros do Canny em `measurement_service.py`

## Desenvolvimento

### Adicionar nova dependência

```bash
pip install nome-do-pacote
pip freeze > requirements.txt
```

### Modo Debug

O servidor já está em modo debug. Para desativar, em `app.py`:
```python
app.run(debug=False, port=5000)
```

### Logs

Os logs aparecem no terminal onde o servidor está rodando.

## Dependências

- **Flask 3.0.0**: Framework web
- **Flask-CORS 4.0.0**: Suporte a CORS
- **OpenCV 4.8.1**: Visão computacional
- **NumPy 1.24.3**: Processamento numérico

## Licença

Propriedade do projeto MacroVision.
