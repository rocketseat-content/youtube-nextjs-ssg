import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

export default function Member({ user }) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <img src={user.avatar_url} alt={user.name} width="80" style={{ borderRadius: 40 }} />
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`https://api.github.com/orgs/rocketseat/members`);
  const data = await response.json();

  const paths = data.map(member => {
    return { params: { login: member.login } }
  });

  return {
    paths,
    fallback: true, 
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { login } = context.params;

  const response = await fetch(`https://api.github.com/users/${login}`);
  const data = await response.json();
  
  return {
    props: {
      user: data,
    },
    revalidate: 10,
  }
}