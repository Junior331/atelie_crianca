# Solução para erro 401 nas imagens do R2

## Problema
As imagens foram enviadas para o bucket R2 com sucesso, mas ao tentar acessá-las via Public Development URL (`https://pub-d50114600aa44bf0a236f33f64195f03.r2.dev/images/*.jpeg`) retornam **HTTP 401 Unauthorized**.

## Causa
O Public Development URL do Cloudflare R2 está habilitado, mas **os objetos não são públicos por padrão**. É necessário configurar permissões de acesso público no bucket.

## Soluções

### Solução 1: Configurar Public Access no Dashboard (RECOMENDADO)

1. Acesse o **Cloudflare Dashboard**
2. Vá em **R2** > **atelie-crianca-images**
3. Clique em **Settings**
4. Procure pela seção **Public Access** ou **Bucket Policy**
5. Adicione uma política de acesso público:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::atelie-crianca-images/*"
    }
  ]
}
```

### Solução 2: Usar Custom Domain (Produção)

O Public Development URL tem limitações conforme aviso do Cloudflare:
> "This URL is rate-limited and not recommended for production"

Para produção, você deve:

1. Adicionar um **Custom Domain** ao bucket
2. Configurar DNS apontando para o bucket R2
3. O custom domain tem melhor suporte a acesso público

**Passos:**
1. No dashboard do bucket, vá em **Settings**
2. Clique em **Connect Domain**
3. Digite seu domínio (ex: `cdn.ateliecrianca.com`)
4. Adicione o registro DNS CNAME conforme instruções
5. Após propagação, use o custom domain no `.env.local`

### Solução 3: Usar Signed URLs (Temporário)

Se não conseguir configurar acesso público, podemos usar URLs assinadas temporárias para cada imagem. Porém, isso:
- Aumenta complexidade
- URLs expiram após X horas
- Não é ideal para site público

## Status Atual

✅ 77 imagens enviadas para R2
✅ Bucket configurado e ativo
✅ CORS configurado
✅ Public Development URL habilitado
❌ **Acesso público aos objetos NÃO está configurado**

## Próximo Passo

**AÇÃO IMEDIATA:** Configure a política de acesso público no dashboard do Cloudflare conforme Solução 1.

Após configurar, teste com:
```bash
curl -I "https://pub-d50114600aa44bf0a236f33f64195f03.r2.dev/images/about.jpeg"
```

Você deve ver `HTTP/1.1 200 OK` ao invés de `401 Unauthorized`.
