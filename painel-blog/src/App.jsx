import { useState } from 'react';
import './App.css';

function App() {
  // Estado que armazena a lista de postagens (Fonte da Verdade)
  const [posts, setPosts] = useState([]);

  // Estados para controlar os campos do formulário
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Estado para controlar se estamos editando um post e qual é o ID dele
  const [editingPostId, setEditingPostId] = useState(null);

  // Função para Criar ou Atualizar um Post (Submit do Formulário)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação: Não permite campos em branco
    if (!title.trim() || !content.trim()) {
      alert('Por favor, preencha o Título e o Conteúdo da postagem!');
      return;
    }

    if (editingPostId) {
      // MODO EDIÇÃO (Update)
      const updatedPosts = posts.map((post) => {
        if (post.id === editingPostId) {
          return { ...post, title: title.trim(), content: content.trim() };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      setEditingPostId(null); // Sai do modo de edição
    } else {
      // MODO CRIAÇÃO (Create)
      const newPost = {
        id: Date.now(), // Identificador único sugerido
        title: title.trim(),
        content: content.trim(),
      };

      // Adiciona o novo post sempre no topo da lista
      setPosts([newPost, ...posts]);
    }

    // Limpa os campos do formulário após publicar/salvar
    clearForm();
  };

  // Função para carregar os dados no formulário para edição (Pre-fill)
  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
  };

  // Função para deletar uma postagem (Delete)
  const handleDeleteClick = (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta postagem?');
    if (confirmDelete) {
      const filteredPosts = posts.filter((post) => post.id !== id);
      setPosts(filteredPosts);
      
      // Se o post deletado estava sendo editado, limpa o formulário
      if (editingPostId === id) {
        clearForm();
        setEditingPostId(null);
      }
    }
  };

  // Função para cancelar a edição voluntariamente
  const handleCancelEdit = () => {
    clearForm();
    setEditingPostId(null);
  };

  // Helper para limpar os inputs
  const clearForm = () => {
    setTitle('');
    setContent('');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Painel Administrativo do Blog</h1>
        <p>Protótipo de gerenciamento de postagens reativo</p>
      </header>

      <main className="main-content">
        {/* SEÇÃO DO FORMULÁRIO (Create / Update) */}
        <section className="form-section">
          <h2>{editingPostId ? 'Editar Postagem' : 'Nova Postagem'}</h2>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                placeholder="Digite o título da postagem..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Conteúdo</label>
              <textarea
                id="content"
                rows="6"
                placeholder="Escreva o conteúdo aqui..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            <div className="button-group">
              <button type="submit" className="btn btn-primary">
                {editingPostId ? 'Salvar Alterações' : 'Publicar'}
              </button>
              
              {editingPostId && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* SEÇÃO DE LISTAGEM (Read / Delete) */}
        <section className="list-section">
          <h2>Postagens Cadastradas ({posts.length})</h2>
          
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma postagem encontrada.</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  
                  <div className="post-actions">
                    <button 
                      className="btn-action btn-edit" 
                      onClick={() => handleEditClick(post)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-action btn-delete" 
                      onClick={() => handleDeleteClick(post.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;