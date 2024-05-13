import Loading from "@/components/loading/Loading";
import { lazy, Suspense } from "react";


export const lazyFn = (importFunc: any, access: boolean = true, url: string = '') => {
  
  if(!access) {
    return (
      <>
        <Loading url={url}></Loading>
      </>
    )
  }
  
  const LazyComponent = lazy(() => {
      return new Promise((resolve) => {
        // setTimeout(() => {
        //   resolve(importFunc());
        // }, 500);
        resolve(importFunc());
      });
    });
  //const LazyComponent = lazy(importFunc);

  return <Suspense fallback={<Loading></Loading>}>
    <LazyComponent />
  </Suspense>;
};    