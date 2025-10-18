@echo off
echo ========================================
echo Iniciando Backend MacroVision
echo ========================================
echo.

REM Verifica se o ambiente virtual existe
if not exist "venv\" (
    echo [ERRO] Ambiente virtual nao encontrado!
    echo Execute primeiro: python -m venv venv
    pause
    exit /b 1
)

REM Ativa o ambiente virtual
echo [INFO] Ativando ambiente virtual...
call venv\Scripts\activate.bat

REM Verifica se as dependências estão instaladas
echo [INFO] Verificando dependencias...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo [AVISO] Dependencias nao encontradas. Instalando...
    pip install -r requirements.txt
)

REM Cria pasta para imagens se não existir
if not exist "static\images\" (
    echo [INFO] Criando pasta para imagens...
    mkdir static\images
)

echo.
echo [OK] Tudo pronto! Iniciando servidor...
echo.
python app.py