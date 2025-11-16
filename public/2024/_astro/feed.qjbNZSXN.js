import{j as e}from"./jsx-runtime.mLGpN2ti.js";import{r as c}from"./index.B1tThdBL.js";function h(){const[r,s]=c.useState({mentions:[],isLoading:!0,error:null});return c.useEffect(()=>{(async()=>{try{const l=`https://webmention.io/api/mentions.jf2?domain=${window.location.hostname}&per-page=50&sort-by=published`,t=await fetch(l);if(!t.ok)throw new Error("Failed to fetch webmentions");const n=await t.json();s(d=>({...d,mentions:n.children,isLoading:!1}))}catch(o){s(i=>({...i,error:o instanceof Error?o.message:"An error occurred",isLoading:!1}))}})()},[]),r.isLoading?e.jsx("div",{className:"social-feed-loading",children:"Loading social interactions..."}):r.error?e.jsxs("div",{className:"social-feed-error",children:["Error: ",r.error]}):e.jsxs("div",{className:"social-feed",children:[e.jsx("h2",{children:"Social Interactions"}),e.jsx("div",{className:"social-feed-list",children:r.mentions.map(a=>e.jsxs("article",{className:"social-feed-item",children:[e.jsxs("header",{className:"social-feed-item-header",children:[e.jsx("img",{src:a.author.photo||"/default-avatar.png",alt:a.author.name,className:"social-feed-avatar",width:48,height:48}),e.jsxs("div",{className:"social-feed-meta",children:[e.jsx("a",{href:a.author.url,target:"_blank",rel:"noopener noreferrer",className:"social-feed-author",children:a.author.name}),e.jsx("time",{dateTime:a.published,children:new Date(a.published).toLocaleDateString()})]})]}),a.content?.text&&e.jsx("div",{className:"social-feed-content",children:a.content.text}),e.jsxs("footer",{className:"social-feed-item-footer",children:[e.jsx("span",{className:"social-feed-type",children:a["wm-property"].replace("-of","")}),e.jsx("a",{href:a["wm-source"],target:"_blank",rel:"noopener noreferrer",className:"social-feed-source",children:"View original"})]})]},a.id))}),r.mentions.length===0&&e.jsx("p",{className:"social-feed-empty",children:"No social interactions found"}),e.jsx("style",{children:`
        .social-feed {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
        }
        
        .social-feed-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .social-feed-item {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 1rem;
        }
        
        .social-feed-item-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .social-feed-avatar {
          border-radius: 50%;
          object-fit: cover;
        }
        
        .social-feed-meta {
          display: flex;
          flex-direction: column;
        }
        
        .social-feed-author {
          font-weight: bold;
          text-decoration: none;
          color: inherit;
        }
        
        .social-feed-content {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        
        .social-feed-item-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #666;
        }
        
        .social-feed-source {
          color: inherit;
          text-decoration: none;
        }
        
        .social-feed-source:hover {
          text-decoration: underline;
        }
        
        .social-feed-loading,
        .social-feed-error,
        .social-feed-empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
      `})]})}export{h as default};
