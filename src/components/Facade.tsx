import React, { ReactNode, Suspense } from "react";

interface Props {
    render: boolean;
    facade: ReactNode;
    element: () => Promise<{ default: React.ComponentType<any> }>;
    props: any;
}

export default function Facade({ render, facade, element, props }: Props) {
    if (!render) {
        return <>{facade}</>;
    }

    const LazyComponent = React.lazy(element);

    return (
        <Suspense fallback={facade}>
            <LazyComponent {...props}></LazyComponent>
        </Suspense>
    );
}
