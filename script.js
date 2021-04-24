//Exemplo de Objeto em JavaScript
const Modal = { 
    //'open' é uma propriedade do 'Objeto' por exemplo. E o que vai dentro do bloco dele ou escopo, é uma funcionalidade.
    open() {
        //Abrir modal
        //Adicionar a class active ao modal
        document.querySelector('.modal-overlay').classList.add('active')//Adicionando a classe active a '<div class="modal-overlay">'
    },
    close() {
        //fechar modal
        //remover a class active do modal
        document.querySelector('.modal-overlay').classList.remove('active') //Removendo a classe active a '<div class="modal-overlay">'
    }
}

/*
Eu preciso somar as entradas.

Depois eu preciso somar as saídas e.

Remover das entradas o valor das saídas.

Assim eu terei o total. 
*/

const Storage = {
    //Pegar informações 
    get() {
        //Transformando string para um Array ou objeto 'ou' devolvendo um array vazio
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    //Guardar informações
    set(transactions) {
        //Guardando dados em JSON como String
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}
 
const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
        
        App.reload()
        //console.log(Transaction.all)
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload();
    },
    incomes() {
        //Somar as entradas
        let income = 0;
        //pegar todas as transações
        //para casa transação
        Transaction.all.forEach(transaction => {
            // se for maior que zero
            if(transaction.amount > 0) {
                // somar a uma variável e retornar a variável
                income += transaction.amount;
            }
        })
        
        return income;
    },
    expenses() {
        //Somar as saídas
        let expense = 0;
        //para cada transação,
        Transaction.all.forEach(transaction => {
            //se for menor que zero
            if(transaction.amount < 0) {
                //somar a uma variavel e retornar a variavel
                expense += transaction.amount;
            }
        })

        return expense;
    },
    total() {
        //Entradas - Saídas
        return Transaction.incomes() + Transaction.expenses();
    }
}

/*
Preciso pegar agora as minhas transações do meu objeto, aqui no JavaScript e colocar lá no HTML

Substituir os dados do HTML, com os dados do JavaScript.
*/

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        //console.log(transaction)
        const tr = document.createElement('tr')//Criando a tag 'tr' para modificar o HTML
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        //console.log(tr.innerHTML)
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense';

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html;
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = {
    formatAmount(value){
        //Ou value = Number(value.replace(/\,\./g, '')) * 100
        value = Number(value) * 100
        //console.log(value)

        return value;
    },

    formatDate(date) {
        const splittedDate = date.split('-')

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''
        
        value = String(value).replace(/\D/g, '')

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        
        return signal + value;
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFields() {
         /*const description = Form.getValues().description
         const amount = Form.getValues().amount
         const date = Form.getValues().date */
         //Ou tbm poderia fazer desta forma
         
        const {description, amount, date} = Form.getValues()
         
        if(description.trim() === '' || amount.trim() === '' || date.trim === '') {
            throw new Error('Por favor preencha todos os campos')
        }
    },
    formatValues() {
        let {description, amount, date} = Form.getValues()
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount, 
            date
        }
    },
    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        event.preventDefault()

        try {
            //Verificar se todas as informações foram preenchidas
            Form.validateFields()
            //formatar os dados para salvar
            const transaction = Form.formatValues()
            //salvar
            Transaction.add(transaction)
            //apagar os dados do formulário
            Form.clearFields()
            //modal feche
            Modal.close()
            
        } catch(error) {
            alert(error.message)
        }
        

    }
}

const App = {
    init() {
        //Tbm poderia fazer desta forma 
        Transaction.all.forEach(DOM.addTransaction)
        /*Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })*/
        
        DOM.updateBalance();
        
        Storage.set(Transaction.all);
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
       
}

App.init();

/*all: [
    {
        description: 'Luz',
        amount: -50001, //Isso representa o valor de -500,00 R$
        date: '23/01/2021',
    },
    {
        description: 'Website',
        amount: 500000, //Isso representa o valor de 5000,00 R$
        date: '23/01/2021',
    },
    {
        description: 'Internet',
        amount: -20012, //Isso representa o valor de -200,00 R$
        date: '23/01/2021',
    },
    {
        description: 'App',
        amount: 200000, //Isso representa o valor de -200,00 R$
        date: '23/01/2021',
    }
]*/