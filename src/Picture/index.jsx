'use client';
import React, { useEffect, useState, useRef } from 'react'
import styles from './style.module.scss';
import { useInView } from 'react-intersection-observer';

export default function Index({src, src10}) {

    const highResImage = useRef(null);
    const lowResImage = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [dimension, setDimension] = useState({width: 0, height: 0})
    const canvas = useRef(null);

    const { ref, inView } = useInView({
        threshold: 0.5,
        triggerOnce: true
    });

    useEffect( () => {
        const { width, height } = lowResImage.current.getBoundingClientRect();
        setDimension({width, height})

        const image = new Image();
        image.onload = () => {
            highResImage.current = image;
            setIsLoaded(true);
        }
        image.style.objectFit = 'cover'
        image.src = src

    }, [])

    useEffect( () => {
        if(inView && isLoaded){
            animate(highResImage.current)
        }
    }, [inView, isLoaded])

    const drawImage = (image) => {
        const ctx = canvas.current.getContext("2d");
        ctx.drawImage(image, 0, 0, dimension.width, dimension.height);
    }

    const animate = (image, amount=64) => {
        const ctx = canvas.current.getContext("2d");
        const w = dimension.width
        const h = dimension.height
        drawImage(image);
        if(amount < 5) return;
        
        const pixelArr = ctx.getImageData(0, 0, w, h).data;
        const sample_size = amount
  
        for (let y = 0; y < h; y += sample_size) {
          for (let x = 0; x < w; x += sample_size) {
            let p = (x + (y*w)) * 4;
            ctx.fillStyle = "rgba(" + pixelArr[p] + "," + pixelArr[p + 1] + "," + pixelArr[p + 2] + "," + pixelArr[p + 3] + ")";
            ctx.fillRect(x, y, sample_size, sample_size);
          }
        }

        setTimeout( () => {
            animate(image, amount/2);
        }, 150)
    }

    return (
        <div ref={ref} className={styles.picture}>
            <img ref={lowResImage} src={src10} />
            <canvas ref={canvas} width={dimension.width} height={dimension.height}></canvas>
        </div>
    )
}
