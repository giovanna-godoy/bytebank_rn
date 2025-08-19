# ByteBank - Aplicação de Gerenciamento Financeiro

Aplicação React Native desenvolvida com Expo para gerenciamento completo de transações financeiras, incluindo autenticação, upload de recibos e análises visuais em tempo real.

## Funcionalidades

### Dashboard
- Saldo em tempo real baseado nas transações
- Gráficos dinâmicos com estatísticas por tipo de transação
- Animações suaves entre seções
- Visualização de data atual

### Gerenciamento de Transações
- Listagem com scroll infinito e paginação
- Filtros por mês e tipo de transação
- Criação, edição e exclusão de transações
- Upload de recibos (imagens e PDFs) no Firebase Storage
- Validação avançada de formulários

### Autenticação
- Login e cadastro com Firebase Auth
- Gerenciamento de perfil de usuário
- Dados isolados por usuário

## Tecnologias Utilizadas

- **React Native** com Expo
- **TypeScript** para tipagem estática
- **Firebase** (Authentication, Firestore, Storage)
- **Context API** para gerenciamento de estado
- **React Navigation** para navegação
- **Expo ImagePicker** e **DocumentPicker** para upload de arquivos
- **Animated API** para animações nativas

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Firebase
- Dispositivo físico ou emulador Android/iOS

## ⚙️ Configuração do Firebase

### 1. Criar Projeto no Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto"
3. Siga as instruções para criar o projeto

### 2. Configurar Authentication
1. No console do Firebase, vá em **Authentication**
2. Clique em **Começar**
3. Na aba **Sign-in method**, habilite:
   - **Email/senha**

### 3. Configurar Firestore Database
1. Vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Iniciar no modo de teste**
4. Selecione uma localização próxima

### 4. Configurar Storage
1. Vá em **Storage**
2. Clique em **Começar**
3. Aceite as regras padrão

### 5. Obter Configurações
1. Vá em **Configurações do projeto** (ícone de engrenagem)
2. Na seção **Seus aplicativos**, clique em **Adicionar app** > **Web**
3. Registre o app com um nome
4. Copie as configurações do Firebase

## Instalação e Configuração

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd bytebank_rn
```

### 2. Instalar Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente
1. Coloque o arquivo `.env` disponível no `.zip` anexado ao Portal na /src.

## Executando o Projeto

### 1. Iniciar o Servidor de Desenvolvimento
```bash
npx expo start
```

### 2. Executar no Dispositivo

#### Opção 1: Emulador Android
```bash
npx expo start --android
```

#### Opção 2: Simulador iOS (apenas macOS)
```bash
npx expo start --ios
```

## Como Usar

### 1. Primeiro Acesso
1. Abra o app
2. Clique em "Criar conta"
3. Preencha os dados e confirme
4. Faça login com suas credenciais

### 2. Gerenciar Transações
1. No dashboard, clique no botão "+" para adicionar transação
2. Preencha os dados (tipo, valor, descrição)
3. Opcionalmente, adicione um recibo
4. Salve a transação

### 3. Visualizar Dados
- **Dashboard**: Veja saldo atual e gráficos
- **Transações**: Liste e filtre suas transações

## Vídeo da aplicação

* Anexado no zip :)

© 2025 Bytebank. Todos os direitos reservados. - Feito por Giovanna G. Lorente