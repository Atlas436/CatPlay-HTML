alter table usuarios add column if not exists token text;

create or replace function autenticar_com_token(p_usuario text, p_senha text)
returns jsonb
language plpgsql
security definer
as $$
declare
  registro usuarios%rowtype;
  novo_token text;
begin
  select * into registro from usuarios where usuario = p_usuario;

  if not found or registro.senha_hash <> crypt(p_senha, registro.senha_hash) then
    return jsonb_build_object('ok', false);
  end if;

  novo_token := encode(gen_random_bytes(24), 'hex');
  update usuarios set token = novo_token where id = registro.id;

  return jsonb_build_object(
    'ok', true,
    'id', registro.id,
    'nome', registro.nome,
    'usuario', registro.usuario,
    'token', novo_token
  );
end;
$$;

create or replace function obter_biblioteca(p_usuario_id bigint, p_token text)
returns jsonb
language plpgsql
security definer
as $$
declare
  resultado jsonb;
begin
  if not exists (select 1 from usuarios u where u.id = p_usuario_id and u.token = p_token) then
    return '[]'::jsonb;
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', bp.id,
        'status', bp.status,
        'progresso', bp.progresso,
        'itens', to_jsonb(i.*)
      )
      order by bp.atualizado_em desc
    ),
    '[]'::jsonb
  )
  into resultado
  from biblioteca_pessoal bp
  join itens i on i.id = bp.item_id
  where bp.usuario_id = p_usuario_id;

  return resultado;
end;
$$;

create or replace function adicionar_biblioteca(p_usuario_id bigint, p_token text, p_item_id bigint, p_status text)
returns boolean
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from usuarios u where u.id = p_usuario_id and u.token = p_token) then
    return false;
  end if;

  insert into biblioteca_pessoal (usuario_id, item_id, status, atualizado_em)
  values (p_usuario_id, p_item_id, p_status, now())
  on conflict (usuario_id, item_id)
  do update set status = excluded.status, atualizado_em = excluded.atualizado_em;

  return true;
end;
$$;

create or replace function atualizar_status_biblioteca(p_usuario_id bigint, p_token text, p_registro_id bigint, p_status text)
returns boolean
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from usuarios u where u.id = p_usuario_id and u.token = p_token) then
    return false;
  end if;

  update biblioteca_pessoal
  set status = p_status, atualizado_em = now()
  where id = p_registro_id and usuario_id = p_usuario_id;

  return found;
end;
$$;

create or replace function remover_biblioteca(p_usuario_id bigint, p_token text, p_registro_id bigint)
returns boolean
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from usuarios u where u.id = p_usuario_id and u.token = p_token) then
    return false;
  end if;

  delete from biblioteca_pessoal
  where id = p_registro_id and usuario_id = p_usuario_id;

  return found;
end;
$$;

grant execute on function autenticar_com_token(text, text) to anon, authenticated;
grant execute on function obter_biblioteca(bigint, text) to anon, authenticated;
grant execute on function adicionar_biblioteca(bigint, text, bigint, text) to anon, authenticated;
grant execute on function atualizar_status_biblioteca(bigint, text, bigint, text) to anon, authenticated;
grant execute on function remover_biblioteca(bigint, text, bigint) to anon, authenticated;

alter table biblioteca_pessoal enable row level security;

do $$
declare
  pol record;
begin
  for pol in select policyname from pg_policies where schemaname = 'public' and tablename = 'biblioteca_pessoal'
  loop
    execute format('drop policy %I on public.biblioteca_pessoal', pol.policyname);
  end loop;
end $$;
