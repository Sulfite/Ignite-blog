import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { BiTime } from 'react-icons/bi';
import { FiCalendar, FiUser,  } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { useState } from 'react';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  // TODO

  const [hasContetBody, setHasContetBody] = useState(post.data.content.map(conten => conten.body.map(item => item.text)));

  return (
    <>
      <Header />

      <div className={styles.containerImage}>
        <img src={post.data.banner.url} alt="" />
      </div>


      <main className={commonStyles.contentContainer}>

        <div className={styles.container}>
          <h1>{post.data.title}</h1>

          <span> 
            <FiCalendar width="1rem" />
            {post.first_publication_date}
          </span>
          <span>
            <FiUser width="1rem" />
            {post.data.author}
          </span>
          <span>
            <BiTime width="1rem" />
            Tempo leitura
          </span>

          <div>
            {post.data.content.map(item => (

              <article key={item.heading} className={styles.headerItem}>
              <h2>{item.heading}</h2>
              <div
                className={styles.contentBody}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(item.body),
                }}
              />
              </article>
            ))}
          </div>
        </div>

      </main>

    </>
  )
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking'
}

  // TODO
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  // console.log(JSON.stringify(response.data.content, null, 2));
  
  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      "ii MMM yyyy",
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      })
    }
  }
  
  // console.log(post);
  // console.log(JSON.stringify(post.data.content, null, 2));
  // console.log(JSON.stringify(response, null, 2));
  // TODO

  return {
    props: {
      post
    }
  }
};
