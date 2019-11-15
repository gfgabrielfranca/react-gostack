import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default function Main() {
  const [newRepo, setNewRepo] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const repositoriesStorage = localStorage.getItem('repositories');

    if (repositoriesStorage) {
      setRepositories(JSON.parse(repositoriesStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('repositories', JSON.stringify(repositories));
  }, [repositories]);

  const handleInputChange = e => {
    setNewRepo(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      repositories.forEach(repositorie => {
        if (repositorie.name === newRepo) {
          throw new Error('Repositório duplicado');
        }
      });

      setError(false);
      setLoading(true);

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      setRepositories([...repositories, data]);
      setNewRepo('');
      setLoading(false);
    } catch (_error) {
      setError(true);
      setNewRepo('');
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1>
        <FaGithubAlt />
        Repositórios
      </h1>

      <Form onSubmit={handleSubmit} error={error}>
        <input
          type="text"
          placeholder="Adicionar repositório"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton loading={loading}>
          {loading ? (
            <FaSpinner color="#fff" size={14} />
          ) : (
            <FaPlus color="#fff" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositories.map(repositorie => (
          <li key={repositorie.name}>
            <span>{repositorie.name}</span>
            <Link to={`/repository/${encodeURIComponent(repositorie.name)}`}>
              Detalhes
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
