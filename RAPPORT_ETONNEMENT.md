# Rapport d'étonnement — claude-setup-tool

Date : 2026-04-10

---

## Ce qui fonctionne bien

**Architecture propre**
- Formulaire multi-étapes bien découpé (rôle → usages → identité → génération)
- Mapping use case → skills/MCPs pertinent et maintenable
- Fallback generator si l'API Claude échoue — bonne résilience
- Validation des champs avec limites de taille côté serveur
- Protection injection de prompt correctement faite : données user isolées en XML avec instruction explicite d'ignorer

**Coûts maîtrisés**
- Claude Haiku pour la génération = bon choix, coût minimal pour ce cas d'usage

---

## Ce qui pose problème

**Rate limiter inopérant en production**
Le `rateLimitMap` est en mémoire (`Map`). Sur Vercel (serverless), chaque invocation peut tourner sur une instance différente. En pratique, le rate limit est bypassé dès qu'une nouvelle instance est spinnée. Il faut Redis ou Vercel KV pour que ça soit réel.

**`linkedin-mcp` référencé mais absent du catalogue**
Dans `getRecommendedMCPs`, le mapping `sales` inclut `"linkedin-mcp"` — mais cette clé n'existe pas dans l'objet `MCPS`. L'install command ne sera jamais affichée. Bug silencieux.

**Le `VERIFY_CMD` est hardcodé sur 4 skills seulement**
Le script de vérification vérifie `setup-by-ben`, `humanizer`, `gtm`, `linkedin-cold-outreach` — mais le catalogue en propose une vingtaine. Les skills installés via `claude plugins install` (Superpowers, etc.) ne sont pas vérifiés du tout.

**Pas d'analytics**
Aucune donnée sur ce qui est réellement demandé : quels rôles, quels usages, combien de générations. Impossible de savoir si le tool est utilisé ni d'améliorer les recommandations.

---

## Idées d'amélioration

1. **Rate limiter** : remplacer le `Map` par Upstash Redis (gratuit, s'intègre en 10 min sur Vercel)
2. **Fix `linkedin-mcp`** : soit ajouter l'entrée dans `MCPS`, soit retirer du mapping
3. **Copy button** : ajouter un bouton "Copier" bien visible sur le résultat généré (UX basique mais manque)
4. **Partage par lien** : stocker les CLAUDE.md générés avec un ID court — permet à l'utilisateur de retrouver ou partager son setup
5. **Analytics légères** : un simple compteur par rôle/usage dans une table Supabase ou Vercel KV pour tracker l'usage réel
