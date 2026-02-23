# Deployment Guide

This document describes the deployment configuration for sankumsek.bio and its blog subdomain.

## Architecture Overview

The project uses a multi-app deployment strategy on Vercel:

- **Main Site** (sankumsek.bio): Terminal-based personal website deployed from root directory
- **Blog** (blog.sankumsek.bio): Sanity-powered blog deployed from `/blog` directory

Both applications are deployed independently but share the same Git repository.

## Vercel Project Setup

### Main Site (sankumsek.bio)

1. **Create Vercel Project**:
   - Import the repository in Vercel
   - Set the root directory to `/` (default)
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

2. **Environment Variables**:
   ```
   NEXT_PUBLIC_SITE_URL=https://sankumsek.bio
   ```

3. **Domain Configuration**:
   - Add custom domain: `sankumsek.bio`
   - Configure DNS records as instructed by Vercel

### Blog Subdomain (blog.sankumsek.bio)

1. **Create Separate Vercel Project**:
   - Import the same repository in Vercel (as a new project)
   - Set the root directory to `/blog`
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

2. **Required Environment Variables**:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<your_sanity_project_id>
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=<your_sanity_api_token>
   NEXT_PUBLIC_SITE_URL=https://blog.sankumsek.bio
   ```

   **How to obtain Sanity credentials**:
   
   - **NEXT_PUBLIC_SANITY_PROJECT_ID**: 
     - Found in your Sanity project dashboard at https://sanity.io/manage
     - Or run `sanity debug --secrets` in the blog directory
   
   - **NEXT_PUBLIC_SANITY_DATASET**: 
     - Default is `production`
     - Can be changed to `development` or custom dataset name
   
   - **SANITY_API_TOKEN**: 
     - Create a token at https://sanity.io/manage
     - Navigate to: Project Settings → API → Tokens → Add API Token
     - Permissions: Editor or Viewer (Editor if using webhooks for revalidation)
     - Copy the token immediately (it won't be shown again)

3. **Domain Configuration**:
   - Add custom domain: `blog.sankumsek.bio`
   - Configure DNS records as instructed by Vercel
   - Ensure the subdomain points to the blog project, not the main site

## Configuration Files

### Root `vercel.json`
Located at the repository root, this configures the main terminal site deployment.

### Blog `vercel.json`
Located at `/blog/vercel.json`, this configures the blog subdomain deployment.

## Deployment Workflow

### Automatic Deployments

Both projects are configured for automatic deployments:

- **Production**: Deploys automatically on push to `main` branch
- **Preview**: Deploys automatically on pull requests

### Manual Deployments

To manually trigger a deployment:

```bash
# Deploy main site
vercel --prod

# Deploy blog
cd blog
vercel --prod
```

## Content Updates

The blog uses Incremental Static Regeneration (ISR) with a 60-second revalidation period:

- Content changes in Sanity CMS will appear on the blog within 60 seconds
- No redeployment needed for content updates
- Optional: Configure Sanity webhooks for instant revalidation

### Setting Up Sanity Webhooks (Optional)

For instant content updates without waiting for ISR:

1. Create a revalidation API route in the blog (if not already present)
2. In Sanity dashboard, go to API → Webhooks
3. Add new webhook:
   - URL: `https://blog.sankumsek.bio/api/revalidate`
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Include drafts: No
4. Add a secret token and configure it in Vercel environment variables

## Monitoring and Logs

- View deployment logs in Vercel dashboard
- Monitor build times and errors
- Check function logs for API routes and ISR

## Troubleshooting

### Build Failures

**Main Site**:
- Check that all dependencies are installed
- Verify environment variables are set
- Review build logs in Vercel dashboard

**Blog**:
- Ensure Sanity credentials are correct
- Verify the blog directory structure is intact
- Check that all required environment variables are set
- Test the build locally: `cd blog && npm run build`

### Content Not Updating

- Wait up to 60 seconds for ISR to revalidate
- Check Sanity API token permissions
- Verify the dataset name matches (production vs development)
- Clear Vercel cache and redeploy if needed

### Domain Configuration Issues

- Verify DNS records are correctly configured
- Check that the subdomain points to the correct Vercel project
- Allow up to 48 hours for DNS propagation

## Local Development

### Main Site
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### Blog
```bash
cd blog
npm install
npm run dev
# Visit http://localhost:3000
```

Note: Both apps run on port 3000 by default. Run them separately or configure different ports.

## Security Notes

- Never commit `.env.local` files to Git
- Rotate Sanity API tokens periodically
- Use environment variables for all sensitive credentials
- Review Vercel deployment logs for exposed secrets

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Multi-App Monorepo Setup](https://vercel.com/docs/concepts/monorepos)
