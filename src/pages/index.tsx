import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  // TODO
  const [hasNextPage, setHasNextPage] = useState(postsPagination.next_page);
  const [hasPosts, setHasPosts] = useState(postsPagination.results);

  async function handleNextPage() {

    fetch(hasNextPage)
      .then(response => response.json())
      .then(data => {
        const postsResults = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              "ii MMM yyyy",
              {
                locale: ptBR,
              }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          }
        })

        
        setHasPosts([...hasPosts, ...postsResults])
        setHasNextPage(data.next_page);
      });
  }

  return (
    <>
      <Head>
        <title>Home | spaceTraveling</title>
      </Head>

      <Header />

      <main className={commonStyles.contentContainer}>
        <div className={styles.posts}>
          {hasPosts.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>

                <div>
                  <time> <FiCalendar width="1rem" /> {post.first_publication_date}</time>
                  <span> <FiUser width="1rem" />  {post.data.author}</span>
                </div>
              </a>
            </Link>
          ))}

          {hasNextPage ?
            <button
              onClick={handleNextPage}
            >
              Carregar mais posts
            </button>
            :
            ''
          }
        </div>
      </main>

    </>
  )
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 3
  });

  const postsResults = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        "ii MMM yyyy",
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResults
  }

  return {
    props: {
      postsPagination
    }
  }
};
