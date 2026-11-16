/// <reference types="cypress"/>
let token 
    beforeEach(()=>{
        cy.gerarToken ('admin@biblioteca.com', 'admin123').then(tkn => {
           token = tkn
        })
    } )

describe('GET - Teste de API - Gestão de usuários ', ()=>{

    it('Deve listar usuários com sucesso', () => {
        cy.api({
            method: 'GET',
            url:'users',
            headers: {'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.users).to.be.an('array')
        })
    })

    it('Deve validar propriedades de um usuário', () =>{
        cy.api({
            method: 'GET',
            url:'users',
            headers: {'Authorization': token}
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.users[0]).to.have.property('id')
            expect(response.body.users[0]).to.have.property('name')
            expect(response.body.users[0]).to.have.property('email')
        })
    })

    it('Deve listar um usuario com sucesso buscando por id', () => {
        cy.api({
            method: 'GET',
            url:'users/1',
            headers: {'Authorization': token}
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('email')
        })
    })

    it('Deve listar usuario com sucesso usando filtro - parametros', ()=> {
        cy.api({
            method:'GET',
            url:'users',
            headers: {'Authorization': token},
            qs: {
                page: 1,
                limit: 20,
                search: 'admin'
            }
        }).should(response => {
            expect(response.status).to.equal(200)})
    })
})

describe ('POST- Teste de API - Gestão de usuários',() =>{
it('Deve cadastrar um usuário com sucesso',() => {
    let email = `juteste${Date.now()}@teste.com`
        cy.api({
            method: 'POST',
            url: 'users',
            body:  {
                "name": "Maria Santos",
                "email": email,
                "password":"senha123"
            }
    }).should(response => {
        expect(response.status).to.equal(201)
    })
})

it('Deve validar um usuário cadastrado com email invalido',() => {
    cy.api({
       method: 'POST',
       url: 'users',
       body:  {
        "name": "Maria Santos",
        "email": "teste0101teste.com",
        "password":"senha123"
       },
       failOnStatusCode: false
    }).should(response => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Formato de email inválido.')
        
    })
})
})

describe('PUT - Teste de API -  Gestão de usuários',() => {

    it('Deve atualizar um usuário com sucesso', () =>{
        cy.api({
        method: 'PUT',
        url: 'users/3',
        headers: {'Authorization': token},
        body:  {
                name: "Maria Santos Alterado",
                email: "teste.alterado2@teste.com",
                password:"senha123alterado"
        }
            }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Usuário atualizado com sucesso.')
            })
    })

    it('Deve atualizar o usuario com sucesso - De forma dinâmica ', () => {

        let email = `juteste${Date.now()}@teste.com`
        cy.cadastrarUsuario('Juliana Azevedo', email, 'senha123').then( userId => {
            cy.api({
        method: 'PUT',
        url: 'users/'+ userId,
        headers: {'Authorization': token},
        body:  {
                name: "Maria Santos Alterado",
                email: email,
                password:"senha123alterado"
        }
            }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Usuário atualizado com sucesso.')
            })
        })
    })
})

describe('DELETE - Teste de API - Gestão de usuário', () => {
    it.skip('Deve excluir um usuário com sucesso', () =>{
        cy.api({
            method: 'DELETE',
            url: 'users/17',
            headers: {'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Usuário removido com sucesso.')
        })
    })
    it('Deve excluir um usuário com sucesso - De forma dinâmica', ()=> {
        cy.cadastrarUsuario('Ju para deletar','ju1234@teste.com','senha123').then(userId=> {
            cy.api({
                method: 'DELETE',
                url: `users/${userId}`,
                headers: {'Authorization': token }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Usuário removido com sucesso.')
            })
        })
    })    
})
