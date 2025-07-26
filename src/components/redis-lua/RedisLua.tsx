import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Editor } from '@monaco-editor/react';

type ExecutionResult = string | any[];

interface ExecutionResponse {
    data: ExecutionResult;
}

const LuaScriptExecutor: React.FC = () => {
    const [script, setScript] = useState<string>('return "ok"');
    const [args, setArgs] = useState<string>('');
    const [result, setResult] = useState<ExecutionResult | null>(null);
    const [error, setError] = useState<string>('');
    const [statusCode, setStatusCode] = useState<number>();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setResult([]);

        try {
            const regex = /,(?![^\[]*\])/;
            // Split the string based on the regex and trim each result
            const response = await fetch('https://redis-lua-server.vercel.app/api/redis-lua', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ script, arguments: [args] }),
            });

            const data: ExecutionResponse = await response.json();
            setStatusCode(response.status);

            if (!response.ok) {
                throw new Error(`${data.data}`);
            }

            setResult(data.data);
        } catch (err) {
            console.log(err);

            setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const renderResult = (result: ExecutionResult) => {
        if (Array.isArray(result)) {
            return (
                <ul className="list-disc list-inside">
                    {result.map((item, index) => (
                        <li key={index}>{JSON.stringify(item)}</li>
                    ))}
                </ul>
            );
        }
        return result;
    };

    return (
        <Card className="pt-16 md:pt-16 lg:pt-24 bg-bgDark3 text-white border-mainBorderDarker">
            <CardHeader>
                <CardTitle><h1>Lua Script Executor</h1></CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-2/3">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Editor
                                    className="mt-1"
                                    height='45vh'
                                    defaultLanguage="lua"
                                    defaultValue={script}
                                    onChange={(value) => value && setScript(value)}
                                    theme='vs-dark'
                                />
                            </div>
                            <div>
                                <label htmlFor="args" className="block text-sm font-medium text-white">
                                    Arguments (comma-separated)
                                </label>
                                <Input
                                    id="args"
                                    value={args}
                                    onChange={(e) => setArgs(e.target.value)}
                                    placeholder="arg1, arg2, arg3"
                                    className="mt-1 text-bgDark1"
                                />
                            </div>
                            <Button type="submit">Execute Script</Button>
                        </form>
                    </div>

                    <div className="w-full md:w-1/3">
                        <h3 className="text-lg font-medium mb-4">Result: {
                        statusCode && <Badge className={statusCode < 300 ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'}>{statusCode}</Badge>}
                        </h3>
                        {error ? (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : result ? (
                            <pre className="p-4 bg-gray-500 rounded-md overflow-x-auto h-[calc(100%-2rem)] whitespace-pre-wrap">
                                {renderResult(result)}
                            </pre>
                        ) : (
                            <p className="text-gray-500 italic">Execute a script to see the result here.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LuaScriptExecutor;